<template>
  <VueFinalModal class="flex justify-center items-center"
    content-class="relative p-4 rounded-lg bg-white dark:bg-gray-900" content-transition="vfm-fade"
    overlay-transition="vfm-fade">
    <div class="custom-modal-content">
      <div v-if="!createIncidentSuccess" class="row">
        <div class="mx-auto d-flex flex-column card card-plain">
          <div class="card-body pb-0">
            <h4 class="font-weight-bolder">Registre seu incidente</h4>
          </div>
        </div>
      </div>
      <div v-if="createIncidentSuccess" class="row">
        <div class="mx-auto d-flex flex-column">
          <div class="card card-plain">
            <div class="card-body d-flex flex-column items-center justify-center">
              <div class="success-message-icon"><i class="fa fa-check"></i></div>
              <span class="success-message-text">Seu incidente foi cadastrado com sucessso!</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!createIncidentSuccess" class="row">
        <div class="mx-auto d-flex flex-column">
          <div class="card card-plain">
            <div class="card-body">
              <form novalidate role="form" class="text-start" @submit.prevent="login">
                <label>Categoria</label>
                <div class="form-group">
                  <v-select :options="categorias" :reduce="item => item.id" v-model="formData.category"
                    @update:modelValue="changeCategoria" placeholder="Selecione uma categoria"
                    class="form-control custom-select" />
                </div>
                <p v-if="errors.category" class="error text-danger">{{ errors.category }}</p>

                <div v-if="campoDescricao">
                  <label>Informações</label>
                  <div v-if="campoDescricao.type === 'TEXT'" class="form-group">
                    <textarea name="text" rows="4" cols="50" class="form-control" placeholder="Preencha uma descrição"
                      :value="formData.value" @input="updateField('value', $event.target.value)"></textarea>
                  </div>
                  <soft-input v-if="campoDescricao.type === 'INT'" type="number" name="number"
                    placeholder="Preencha um valor" step="1" :value="formData.value"
                    @input="updateField('value', $event.target.value)" />
                  <soft-input v-if="campoDescricao.type === 'FLOAT'" type="number" name="float"
                    placeholder="Preencha um valor" step="0.01" :value="formData.value"
                    @input="updateField('value', $event.target.value)" />
                  <div v-if="campoDescricao.type === 'LOGIC'" class="form-group">
                    <div class="d-flex">
                      <soft-radio id="sim" name="value" :value="formData.value"
                        @input="updateField('value', '1')">Sim</soft-radio>
                      <soft-radio id="nao" name="value" class="mx-4" :value="formData.value"
                        @input="updateField('value', '0')">Não</soft-radio>
                    </div>
                  </div>
                  <p v-if="errors.value" class="error text-danger">{{ errors.value }}</p>
                </div>
                <soft-alert v-if="createIncidentError" color="danger">
                  Houve um erro ao cadastrar seu incidente. Tenta novamente ou entre em contato conosco.
                </soft-alert>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!createIncidentSuccess" class="row">
        <div class="mx-auto">
          <div class="card card-plain">
            <div class="row card-body pb-0">
              <div class="col-6 ms-auto">
                <a class="btn btn-outline-dark w-100" @click="closeModal"
                  :class="isLoading ? 'disabled-btn' : ''">Fechar</a>
              </div>
              <div class="col-6 ms-auto">
                <a class="btn btn-primary w-100" @click="cadastrarIncidente" :class="isLoading ? 'disabled-btn' : ''">{{
                  isLoading ?
                    'Cadastrando...' : 'Cadastrar' }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
<script>
import { VueFinalModal } from 'vue-final-modal';
import SoftInput from "@/components/SoftInput.vue";
import SoftButton from "@/components/SoftButton.vue";
import SoftAlert from "@/components/SoftAlert.vue";
import SoftRadio from "@/components/SoftRadio.vue";
import api, { httpClient } from "@/services/api";

export default {
  name: "NewIncidentModal",
  components: {
    SoftInput,
    SoftButton,
    SoftAlert,
    SoftRadio,
    VueFinalModal,
  },
  data() {
    return {
      formData: {
        category: '',
        value: '',
      },
      errors: {},
      submitAttempt: false,
      createIncidentSuccess: false,
      createIncidentError: false,
      geolocationError: false,
      geolocationNotSupported: false,
      isLoading: false,
      categorias: [],
      campoDescricao: null,
    };
  },
  created() {
    this.getCategorias();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    updateField(field, value) {
      let valueAux = value;
      if (this.campoDescricao.type === 'INT') {
        valueAux = String(parseInt(valueAux));
      }

      this.formData[field] = valueAux;

      if (this.submitAttempt) {
        switch (field) {
          case 'value':
            this.validateDescricao();
            break;
          default:
            break;
        }
      }
    },
    changeCategoria(value) { // Função para mudar o campo "Descrição" com base no tipo da categoria selecionada
      if (this.submitAttempt) {
        this.validateCategoria();
      }

      const categoriaSelecionada = this.categorias.find(categoria => categoria.id === value);
      console.log(categoriaSelecionada);

      // Limpar campo descrição ao mudar de categoria
      this.formData.value = '';

      if (categoriaSelecionada) {
        this.campoDescricao = {
          type: categoriaSelecionada.type,
          validation: categoriaSelecionada.validation
        };
        this.errors.value = '';
      }
    },
    validateDescricao() { // Validação do campo Descrição com base na regex
      const descricao = this.formData.value;
      if (!descricao) {
        this.errors.value = 'Informação é obrigatória.';
        return;
      }

      // Caso haja uma regex para validação, utilizamos ela
      if (this.campoDescricao?.validation) {
        const regex = new RegExp(this.campoDescricao.validation);
        if (!regex.test(descricao)) {
          this.errors.value = 'Informação inválida.';
          return;
        }
      }

      // Se passou na validação
      this.errors.value = '';
    },
    validateCategoria() { // Validação e cadastro de incidentes
      if (!this.formData.category) {
        this.errors.category = 'Categoria é obrigatória.';
      } else {
        this.errors.category = '';
      }
    },
    async coletarLocalizacao() { // Coleta localização e carrega categorias ao montar o componente
      return new Promise((resolve, reject) => {
        this.geolocationError = false;
        this.geolocationNotSupported = false;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              this.geolocationError = false;
              this.geolocationNotSupported = false;
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              this.geolocationError = true;
              this.geolocationNotSupported = false;
              console.log('Erro ao obter localização: ' + error.message);
              reject(error);
            }
          );
        } else {
          this.geolocationError = false;
          this.geolocationNotSupported = true;
          // alert('Geolocalização não é suportada pelo navegador.');
          reject(new Error('Geolocalização não suportada.'));
        }
      });
    },
    async cadastrarIncidente() {
      this.submitAttempt = true;
      this.createIncidentError = false;

      this.validateCategoria();
      this.validateDescricao();

      console.log(this.formData);

      if (Object.values(this.errors).some(error => error)) {
        // alert('Por favor, corrija os erros antes de cadastrar o incidente.');
        return;
      }

      try {
        this.isLoading = true;

        const { latitude, longitude } = await this.coletarLocalizacao();

        let responseIp = await httpClient.get('https://api.ipify.org?format=json');

        console.log(responseIp.data);

        this.formData.user = localStorage.getItem("id");
        this.formData.vendorId = responseIp.data.ip + '_' + this.formData.user,
          this.formData.latitude = latitude;
        this.formData.longitude = longitude;

        // Configura os dados para o corpo da requisição
        const requestData = {
          ref_user: this.formData.user,
          ref_vendor_id: this.formData.vendorId,
          ref_category: this.formData.category,
          latitude: this.formData.latitude,
          longitude: this.formData.longitude,
          value: this.formData.value,
        };

        // Realiza a requisição POST para a API
        const response = await api.post('/incidents', requestData);

        console.log(response.data);

        this.isLoading = false;
        this.createIncidentSuccess = true;

        setTimeout(() => {
          this.closeModal();
          window.location.reload();
        }, 2000);

        // Limpa o formulário
        this.formData = {
          category: '',
          value: '',
          latitude: null,
          longitude: null,
          user: null
        };
        this.campoDescricao = null;
      } catch (error) {
        this.isLoading = false;
        this.createIncidentError = true;
        this.createIncidentSuccess = false;
        console.error('Erro ao cadastrar incidente:', error);
        // alert('Erro ao cadastrar incidente. Verifique o console para mais detalhes.');
      }
    },
    async getCategorias() {
      try {
        let response = await api.get('/categories');

        // Verifique a estrutura dos dados
        console.log('Dados da API:', response.data);

        // Se response.data for um objeto com a chave "data" que contém um array:
        if (response.data) {
          // Converte response.data.data para um array e mapeia para extrair o id, description, validation, type
          this.categorias = response.data.map(item => ({
            id: item.id, // O ID será o valor da opção
            label: item.description, // A descrição será o texto visível
            validation: item.regex_validation,
            type: item.type.toUpperCase() // Garantir que o tipo seja maiúsculo
          }));
        } else {
          console.error('Estrutura inesperada de dados:', response.data);
        }

        console.log('Categorias carregadas:', this.categorias);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    }
  },
};
</script>

<style scoped>
.custom-modal-content {
  width: 500px;
}
.error {
  font-size: 12px;
  margin-top: -10px;
}
.alert {
  font-size: 14px;
  font-weight: normal !important;
  line-height: 1.4;
}
</style>