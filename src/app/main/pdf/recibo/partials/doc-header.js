function docHeader(data) {
  const { document, ra, nome } = data;

  const docHeader = [
    {
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: document,
              style: 'header',
            },
          ],
        ],
      },
    },
    {
      table: {
        widths: ['*', 150],
        body: [
          [
            {
              text: [
                {
                  text: 'Aluno(a): ',
                  style: 'label',
                },
                nome,
              ],
              border: [true, false, true, true],
            },
            {
              text: [
                {
                  text: 'RA: ',
                  style: 'label',
                },
                ra,
              ],
              border: [true, false, true, true],
            },
          ],
        ],
      },
    },
    // {
    //   table: {
    //     widths: ['*', 150],
    //     body: [
    //       [
    //         {
    //           text: [
    //             {
    //               text: 'Endereço: ',
    //               style: 'label',
    //             },
    //             `${street} - Nº ${number} - ${district} - ${city}-${state}`,
    //           ],
    //           border: [true, false, true, true],
    //         },
    //         {
    //           text: [
    //             {
    //               text: 'Telefone: ',
    //               style: 'label',
    //             },
    //             tel,
    //           ],
    //           border: [true, false, true, true],
    //         },
    //       ],
    //     ],
    //   },
    // },
    // {
    //   table: {
    //     widths: ['*'],
    //     body: [
    //       [
    //         {
    //           text: [
    //             {
    //               text: 'Empregado: ',
    //               style: 'label',
    //             },
    //             employee,
    //           ],
    //           border: [true, false, true, true],
    //         },
    //       ],
    //     ],
    //   },
    // },
    // {
    //   table: {
    //     widths: ['*', '*'],
    //     body: [
    //       [
    //         {
    //           text: [
    //             {
    //               text: 'CPF: ',
    //               style: 'label',
    //             },
    //             cpf,
    //           ],
    //           border: [true, false, true, true],
    //         },
    //         {
    //           text: [
    //             {
    //               text: 'RG: ',
    //               style: 'label',
    //             },
    //             rg,
    //           ],
    //           border: [true, false, true, true],
    //         },
    //       ],
    //     ],
    //   },
    // },
  ];

  return docHeader;
}

export default docHeader;
