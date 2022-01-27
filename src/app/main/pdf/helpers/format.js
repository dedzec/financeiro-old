import extenso from 'extenso';

class Format {
  mask(value, mask) {
    const array = [...value.replace(/\D/g, '')];

    const limit =
      mask.slice(0, value.length)[value.length - 1] !== 'x'
        ? mask.slice(0, value.length + 1)
        : mask.slice(0, value.length);

    return limit.replace(/x/g, () => array.shift() || '');
  }

  currency(value) {
    return Intl.NumberFormat('pt-br', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  numberToReal(valeu) {
    valeu = valeu.toFixed(2).split('.');
    valeu[0] = valeu[0].split(/(?=(?:...)*$)/).join('.');
    return valeu.join(',');
  }

  minimum(value) {
    return value.toLocaleString('pt-br', {
      minimumFractionDigits: 2,
    });
  }

  extensive(value) {
    // console.log('value 1', this.minimum(value));
    // console.log('value 2', this.numberToReal(value));
    value = String(this.minimum(value));
    // value = value.includes('.') ? value.replace('.', ',') : value;
    // console.log(value);
    const sentence = extenso(value, { mode: 'currency' });

    return sentence.slice(0, 3) === 'mil' ? `um ${sentence}` : sentence;
  }
}

export default Format;
