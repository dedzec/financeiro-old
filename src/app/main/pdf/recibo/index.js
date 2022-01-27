import docHeader from './partials/doc-header';
import docFooter from './partials/doc-footer';
import docStyles from './partials/doc-styles';

import Format from '../helpers/format';

const correctDate = (date) => {
  return date < 10 ? `0${date}` : date;
};

const dateFormat = (date) => {
  let dt = new Date(date);
  return `${correctDate(dt.getDate())}/${correctDate(
    dt.getMonth() + 1
  )}/${dt.getFullYear()}`;
};

const recibo = (data) => {
  const company = 'Instituto Dom Barreto';
  // const { valor, createdAt, descricao, tipo, tiposFormat } = data;
  const { valor, createdAt, descricao, tiposFormat, abSerie, turma } = data;
  // const document = `Recibo de ${tipo}`;
  const document = `Recibo Dom Barreto`;

  const format = new Format();

  const docDefinition = {
    content: [
      ...docHeader({ ...data, document, company }),
      {
        table: {
          widths: ['*', '*'],
          body: [
            [
              {
                text: [
                  {
                    text: 'Valor: ',
                    style: 'label',
                  },
                  format.currency(valor),
                ],
                border: [true, false, true, true],
              },
              {
                text: [
                  {
                    text: 'Data: ',
                    style: 'label',
                  },
                  dateFormat(createdAt),
                ],
                border: [true, false, true, true],
              },
            ],
            [
              {
                text: [
                  {
                    text: 'Série: ',
                    style: 'label',
                  },
                  abSerie,
                ],
                border: [true, false, true, true],
              },
              {
                text: [
                  {
                    text: 'Turma: ',
                    style: 'label',
                  },
                  turma,
                ],
                border: [true, false, true, true],
              },
            ],
          ],
        },
      },
      {
        table: {
          widths: ['*'],
          body: [
            [
              {
                text: `Declaro que recebi a quantia líquida de ${format.currency(
                  valor
                )} - ${format.extensive(valor)}, referente ao pagamento de:`,
                margin: [10, 10, 10, 2],
                border: [true, false, true, false],
              },
            ],
            ...tiposFormat,
            [
              {
                text: `Obs: ${descricao}`,
                margin: [10, 0, 10, 10],
                border: [true, false, true, false],
              },
            ],
          ],
        },
      },
      ...docFooter(company),
    ],
    ...docStyles,
  };

  return docDefinition;
};

export default recibo;
