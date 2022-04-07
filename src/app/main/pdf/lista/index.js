import FormatDate from '../helpers/format-date';

import img from './imgidb';

const lista = (data) => {
  // console.log('data', data);
  const { titulo, recibos, turma, alunos } = data;

  const formatDate = new FormatDate();

  const header = [
    { text: '#', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
    { text: 'RA', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
    { text: 'NOME', bold: true, fontSize: 9, margin: [0, 4, 0, 0] },
    {
      text: 'ASSINATURA',
      bold: true,
      fontSize: 9,
      margin: [0, 4, 0, 0],
    },
  ];
  const body = alunos.map((aluno, index) => {
    return [
      { text: `${index + 1}`, fontSize: 8, margin: [0, 12, 0, 0] },
      { text: aluno.ra, fontSize: 8, margin: [0, 12, 0, 0] },
      { text: aluno.nome, fontSize: 8, margin: [0, 12, 0, 0] },
      {
        text: '_________________________________________________________________________',
        fontSize: 8,
        margin: [0, 15, 0, 0],
      },
    ];
  });
  const lineHeader = [
    {
      text: '____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
      alignment: 'left',
      fontSize: 5,
      colSpan: 4,
      margin: [0, 0, 0, 10],
    },
    {},
    {},
  ];
  const headerline = [header, lineHeader];
  const content = [...headerline, ...body];

  const docDefinition = {
    watermark: {
      text: 'Instituto Dom Barreto',
      color: 'blue',
      opacity: 0.3,
      bold: true,
      italics: false,
    },
    pageSize: 'A4',
    pageMargins: [14, 53, 14, 48],
    // header: () => {
    //   return {
    //     margin: [14, 12, 14, 0],
    //     layout: 'noBorders',
    //     table: {
    //       widths: ['auto'],
    //       body: [
    //         [
    //           {
    //             // if you specify both width and height - image will be stretched
    //             image: img,
    //             width: 30,
    //             alignment: 'right',
    //           },
    //           {
    //             text: `${turma.serie} ${turma.turma} - ${turma.filial}\n${recibos}`,
    //             style: 'reportName',
    //             alignment: 'center',
    //           },
    //         ],
    //         [
    //           {
    //             text: `${recibos}`,
    //             style: 'reportName',
    //           },
    //         ],
    //       ],
    //     },
    //   };
    // },
    header: {
      margin: 10,
      columns: [
        // {
        //   margin: [10, 0, 0, 0],
        //   text: 'Here goes the rest',
        // },
        {
          text:
            titulo.length > 0
              ? `${titulo}\n\n${turma.serie} ${turma.turma} - ${turma.filial}\n${recibos}`
              : `${turma.serie} ${turma.turma} - ${turma.filial}\n${recibos}`,
          style: 'reportName',
          margin: [25, 0, 0, 0],
          alignment: 'center',
        },
        {
          // usually you would use a dataUri instead of the name for client-side printing
          // sampleImage.jpg however works inside playground so you can play with it
          image: img,
          width: 35,
        },
        // {
        //   text: `${recibos}`,
        //   style: 'reportName',
        // },
      ],
    },
    content: [
      {
        layout: 'noBorders',
        table: {
          headerRows: 2,
          widths: [25, 55, 200, '*'],
          body: content,
        },
      },
    ],
    footer(currentPage, pageCount) {
      return {
        layout: 'noBorders',
        margin: [14, 0, 14, 22],
        table: {
          widths: ['auto'],
          body: [
            [
              {
                text: '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________',
                alignment: 'center',
                fontSize: 5,
              },
            ],
            [
              [
                {
                  text: `Página ${currentPage.toString()} de ${pageCount}`,
                  fontSize: 7,
                  alignment: 'right',
                  /* horizontal, vertical */
                  margin: [3, 0],
                },
                {
                  text: `${formatDate.finalDateTime(
                    formatDate.todayDateTime()
                  )}`,
                  fontSize: 7,
                  alignment: 'left',
                  margin: [0, -7],
                },
                {
                  text: 'INSTITUTO DOM BARRETO',
                  fontSize: 7,
                  alignment: 'center',
                },
              ],
            ],
          ],
        },
      };
    },
    styles: {
      reportName: {
        fontSize: 9,
        bold: true,
        alignment: 'center',
        margin: [0, 4, 0, 0],
      },
    },
  };

  return docDefinition;
};

export default lista;
