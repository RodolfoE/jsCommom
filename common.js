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
