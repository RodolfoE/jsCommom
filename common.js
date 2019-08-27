Array.prototype.pushArray = function(arr) {
  this.push.apply(this, arr);
};
const datePickerConf = {
  dateFormat: 'dd-mm-yy',
  dayNames: [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez'
  ],
  nextText: 'Próximo',
  prevText: 'Anterior'
};

/*
  inicial: string data em formato 'pt-br' padrão
  final: string data em formato 'pt-br' padrão
  return: boolean
*/
function dataInicialMenorOuIgualQueFinal(inicial, final) {
  return moment(obterDataEmFormatoSql(inicial)).isSameOrBefore(
    obterDataEmFormatoSql(final)
  );
}

/*
  data: string data em formato ISO-8601 ex: 2015-03-04T00:00:00.000Z (ano-mes-diaThrs:minutos:segundosZ)
  return: data formata padrão: dia mes ano. ex: 27 Feb 2013
*/
function obterDataFormatada(data) {
  if (data.length < 24 || data.indexOf('T') === -1) {
    throw {
      tipo: 'ISO-8601',
      msg: `O padrão da data não é o especificado. Ou seja, foge a normalização ISO-8601!`
    };
  }
  moment.locale('pt-br');
  return moment(data)
    .utcOffset(00)
    .format('ll')
    .replace('de', ' ')
    .replace('de', ' ');
}

/*
  data: string data em formato ISO-8601 ex: 2015-03-04T00:00:00.000Z (ano-mes-diaThrs:minutos:segundosZ)
  return: data formata padrão: dia mes ano. ex: 27-02-2013
*/
function obterDataFormatoPadrao(data) {
  if (data.length < 24 || data.indexOf('T') === -1) {
    throw {
      tipo: 'ISO-8601',
      msg: `O padrão da data não é o especificado. Ou seja, foge a normalização ISO-8601!`
    };
  }
  moment.locale('pt-br');
  return moment(data)
    .utcOffset(00)
    .format('DD-MM-YYYY');
}

/*
  val: string data em formato 'pt-br' padrão
  return: string data em formato 'en' padrão (mes-dia-ano)
*/
function obterDataEmFormatoSql(val) {
  if (checkNull(val))
    return `${val.split('-')[1]}-${val.split('-')[0]}-${val.split('-')[2]}`;
  return '';
}

function obterDataEmFormatoSqlIso(val) {
  if (checkNull(val))
    return new Date(
      `${val.split('-')[1]}-${val.split('-')[0]}-${val.split('-')[2]}`
    ).toISOString();
  return '';
}

/*
  Checa se data está no formato correto e se não excede a quantidade do mês.
  data: formato 'pt-br' padrão
  return: boolean 
*/
function estaDataEmFormatoValido(data) {
  return moment(data, 'DD-MM-YYYY').isValid();
}

String.prototype.insert = function(index, string) {
  if (index > 0)
    return (
      this.substring(0, index) + string + this.substring(index, this.length)
    );

  return string + this;
};

function validateExtentions(val, extentions) {
  let bool = false;
  let extention;
  for (let i = 0; i < extentions.length; i++) {
    let extention = `.${extentions[i]}`;
    if (val.endsWith(extention)) {
      bool = true;
    }
  }
  return bool;
}

function validateFloat(val) {
  if (!isNaN(val)) return false;
  return true;
}

function replaceComma(val) {
  return val.replace(/,/g, '.');
}

function validateCNPJ(cnpj) {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj == '') return false;

  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj == '00000000000000' ||
    cnpj == '11111111111111' ||
    cnpj == '22222222222222' ||
    cnpj == '33333333333333' ||
    cnpj == '44444444444444' ||
    cnpj == '55555555555555' ||
    cnpj == '66666666666666' ||
    cnpj == '77777777777777' ||
    cnpj == '88888888888888' ||
    cnpj == '99999999999999'
  )
    return false;

  // Valida DVs
  tamanho = cnpj.length - 2;
  numeros = cnpj.substring(0, tamanho);
  digitos = cnpj.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
}

function validateDateFormat(date, dateFormat) {
  return moment(date, dateFormat, true).isValid();
}

function validateMultipleDates() {
  let dateFormat = arguments[0];

  for (let i = 1; i < arguments.length; i++) {
    if (!moment(arguments[i], dateFormat, true).isValid()) return false;
  }

  return true;
}

function trataNulo(dado) {
  return dado === null || dado === 'null' || dado === undefined ? '' : dado;
}

function validateCPF(strCPF) {
  strCPF = strCPF.replace(/[^\d]+/g, '');
  let Soma;
  let Resto;
  Soma = 0;
  if (strCPF == '00000000000') return false;

  for (i = 1; i <= 9; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(9, 10))) return false;

  Soma = 0;
  for (i = 1; i <= 10; i++)
    Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
  Resto = (Soma * 10) % 11;

  if (Resto == 10 || Resto == 11) Resto = 0;
  if (Resto != parseInt(strCPF.substring(10, 11))) return false;
  return true;
}

function ssDateFormat(ssData) {
  if (checkNull(ssData)) {
    let splitData = ssData.split('T')[0];
    return moment(splitData).format('DD-MM-YYYY');
  }
  return '';
}

function checkNull(obj) {
  return (
    obj !== null &&
    obj !== 'null' &&
    obj !== 'NULL' &&
    obj !== '' &&
    typeof obj !== 'undefined'
  );
}

function checkMultipleNull() {
  for (let i = 0; i < arguments.length; i++) {
    if (!checkNull(arguments[i])) return false;
  }

  return true;
}

function dateYearFirst(val) {
  return `${val.split('-')[2]}-${val.split('-')[1]}-${val.split('-')[0]}`;
}

function isNumberKey(evt) {
  const charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

  return true;
}

/*
  idField: id no DOM, em formato jquery. ex: #id
  valido: atribui ou remove classe css de erro.
  .err {
    border-color: #ff000099 !important;
  }
*/
function campoValido(idField, valido) {
  if (valido) {
    $(idField).removeClass('err');
  } else {
    $(idField).addClass('err');
  }
}

function getInputName(key) {
  return `${key}_input`;
}

const validaEmpresaName = val => {
  var patt = new RegExp('^.*:[0-9](?:.{10}|.{13})$');
  return patt.test(val);
};

function chamadaAjax(url, dado, funcaoSucesso, funcaoErro) {
  $.getJSON(url, dado, funcaoSucesso).fail(funcaoErro);
}

function erroGeneralistico(err) {
  showAlert(err.responseJSON.err, 2000);
  console.log(err);
}

function getGcTempUrl(arquivo) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: 'GET',
      url: `/get_temp_url?arquivo=${arquivo}`,
      dataType: 'json',
      success: data => {
        resolve(data);
      },
      error: err => {
        reject(err);
      }
    });
  });
}

async function copyCnpj(event) {
  try {
    const cnpj = $(
      '#' +
        $(event.target)
          .next()
          .attr('id')
    )
      .val()
      .replace(/[\.//-]/g, '');
    await navigator.clipboard.writeText(cnpj);
    showAlert('CNPJ/CPF copiado com sucesso.', 2000);
  } catch (err) {
    tratamentoErroPadrao({
      tipo: 'regraDeNegocio',
      msg: `Não foi possível copiar o CNPJ/CPF.`
    });
  }
}

function execRequisicaoHttp(type, url, filtro) {
  return $.ajax({
    type: type,
    url: url,
    data: filtro,
    contentType: type === 'GET' ? 'json' : 'application/json'
  });
}

function execRequisicaoHttpMimeType(type, url, filtro, mimeType) {
  return $.ajax({
    type: type,
    url: url,
    data: filtro,
    beforeSend: function(request) {
      request.setRequestHeader('Content-Type', mimeType);
    }
  });
}

function tratamentoErroPadrao(e) {
  if (e.tipo) {
    switch (e.tipo) {
      case 'regraDeNegocio':
        showAlert(e.msg, 2000);
        break;
      case 'ISO-8601':
        showAlert('Ocorreu um erro interno.', 3000);
        console.log(e.msg);
        break;
      case 'FormatoIncorreto':
        showAlert('Ocorreu um erro interno.', 3000);
        console.log(e.msg);
        break;
      case 'Duplicata':
        showAlert('Não é possível inserir registro duplicado.', 3000);
        console.log(e.msg);
        break;
      case 'ApenasLog':
        console.log('ERRO: \n');
        console.log(e.err.responseJSON.err + '\n');
        console.log(e.err);
        break;
    }
  } else if (e.responseJSON) {
    showAlert(e.responseJSON.err, 3000);
  } else {
    showAlert('Ocorreu um erro interno.', 3000);
    console.log('ERRO: \n');
    console.log(e);
  }
}

/**
  @param id: id do select2 com # do jquery
  @param data: dados do select2. Formato: {id: 0; text: ''}
  @param itemSelecionado: item que virá selecionado ou null para exibir placeholder
  @param tag: se != null, permite select2 insira elementos que não estão listados.
*/
function initSelect2(id, data, placeholder, itemSelecionado, tag) {
  if (data) {
    if (
      !data[0] ||
      isNullUndefinedOrEmpty(data[0].id) ||
      isNullUndefinedOrEmpty(data[0].text)
    ) {
      throw {
        tipo: 'FormatoIncorreto',
        msg: `Erro ao preencher select2. Formato incompatível.`
      };
    }
  }
  if (!$(id).data('select2')) {
    if (tag) {
      $(id).select2({
        data: data,
        placeholder: placeholder,
        width: '100%',
        allowClear: true,
        tags: true
      });

      $(id).on('select2:closing', () => {
        let valorDigitado = $('.select2-search__field').val();
        let vlrInseridoNoSelect2 = $(id + ' :selected').text();
        if (valorDigitado !== vlrInseridoNoSelect2) {
          $(id)
            .val(null)
            .trigger('change');
        }
      });
    } else {
      $(id).select2({
        data: data,
        placeholder: placeholder,
        width: '100%',
        allowClear: true
      });
    }
  } else {
    $(id)
      .empty()
      .trigger('change');
    data.forEach(e => {
      $(id).append(new Option(e.text, e.id, false, false));
    });
    $(id).trigger('change');
  }

  if (itemSelecionado) {
    $(id)
      .val(trataNulo(itemSelecionado))
      .trigger('change');
  } else {
    $(id)
      .val(null)
      .trigger('change');
  }
}

function obterDescricaoFuncao(idFunc) {
  switch (idFunc) {
    case 'C':
      return 'Contábil';
    case 'F':
      return 'Fiscal';
    case 'P':
      return 'Pessoal';
    case 'A':
      return 'Administrativo';
  }
}

function obterDescricaoPeriodicidade(idPer) {
  switch (idPer) {
    case 'M':
      return 'Mensal';
    case 'A':
      return 'Anual';
    case 'M2':
      return 'Mensal + 2 meses';
  }
}

function obterDescricaoTrueFalse(vlr) {
  if (vlr === true || vlr !== null || vlr !== undefined) {
    if (vlr === true || vlr === '1') {
      return 'Sim';
    } else if (vlr === false || vlr === '0') {
      return 'Não';
    }
  }
}

function isNullUndefinedOrEmpty(vlr) {
  if (vlr == null || vlr === 'null' || vlr === '' || vlr.length === 0) {
    return true;
  }
  return false;
}

function obterTrueFalse(vlr) {
  if (vlr === true) {
    return vlr;
  } else if (vlr === false) {
    return vlr;
  }
  if (vlr === 'true') {
    return true;
  } else if (vlr === 'false') {
    return false;
  }
  if (vlr === 1) {
    return true;
  } else if (vlr === 0) {
    return false;
  }
  if (vlr === '1') {
    return true;
  } else if (vlr === '0') {
    return false;
  }
  return '';
}

function obterDescricaoTipoItem(codigo) {
  switch (codigo) {
    case '00':
      return 'Mercadoria para Revenda';
    case '01':
      return 'Matéria-prima';
    case '02':
      return 'Embalagem';
    case '07':
      return 'Material de Uso e Consumo';
    case '08':
      return 'Ativo Imobilizado';
    case '10':
      return 'Outros insumos';
    default:
      return '';
  }
}

/*
return: msg de erro. Se for null, o NCM está correto.
*/
function validarNCM(ncm) {
  if (ncm.length !== 8) {
    return 'O campo NCM deve conter 8 caracteres';
  }
  if (ehSequencial(ncm)) {
    return 'O campo NCM não pode ser sequencial';
  }
  return null;
}

/*
n: string ou número
return: true caso o número for sequencial, false caso contrário.
*/
function ehSequencial(n) {
  var numbers = '0123456789';
  var numbersRev = '9876543210';
  return (
    numbers.indexOf(String(n)) !== -1 && numbersRev.indexOf(String(n)) === -1
  );
}

function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function setCookie(cname, cvalue, exMin) {
  var d = new Date();
  d.setTime(d.getTime() + exMin * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function deleteCookie(cname) {
  document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

/* Node Common */
function convertBase64ToUtf8(){
  var zlib =require('zlib');
  const text =
  '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';

  var buf =Buffer.from(text, 'base64');

  zlib.unzip(buf, function(err, dezipped) {
    console.log(dezipped.toString());
  });
}

const moment = require('moment');

module.exports.getCustomErr = (code, message) => {
	
	let err = new Error();
	err.code = code;
	err.message = message;
	
	return err;
};

module.exports.validaSqlServerData = (data) => {

    if (moment(data, "YYYY-MM-DD[T]HH:mm:ssZ", true).isValid()) {
        return data;
    }

    return null;
        
};

module.exports.validaYYYYMMDD = (data) => {

    if (moment(data, "YYYY-MM-DD", true).isValid()) {
        return data;
    }

    return null;
        
};

module.exports.parseToYYYYMMDD = (data) => {


    const tryDate = moment(data, 'DD-MM-YYYY', true).format('YYYY-MM-DD');

    if (tryDate == 'Invalid date') return null;

    return tryDate;
}


module.exports.parseDDMMYYYY = (data) => {


    const tryDate = moment(data, 'YYYY-MM-DD', true).format('DD-MM-YYYY');

    if (tryDate == 'Invalid date') return null;

    return tryDate;
}


module.exports.validaInt = (n) => {
    
    if (!isNaN(n)) {
        
        n = Number(n);

        if (n === parseInt(n, 10)) {
            
            return true;
        }
    }

    return false;
};

module.exports.validaFloat = (n) => {
    
    if (!isNaN(n)) {
        n = Number(n);

        if (n % 1 !== 0) {
            
            return n.toFixed(2);
        }

        return n;
    }

    return 0;
};

module.exports.validaEmail = (email) => {

	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(String(email).toLowerCase());
};

module.exports.verificaIntegridade = (val) => {

	if (!val || val === null || val === 'null' || typeof val === 'undefined' || val === '') return false;

	return true;
};

module.exports.parseIntegridade = (val) => {

	if (!val || val === null || val === 'null' || typeof val === 'undefined' || val === '') return null;

	return val;
};
