const correctDate = (date) => {
  return date < 10 ? `0${date}` : date;
};

const dateFormat = () => {
  let dt = new Date();
  return `${correctDate(dt.getDate())}/${correctDate(
    dt.getMonth() + 1
  )}/${dt.getFullYear()}`;
};

function docFooter(company) {
  const docFooter = [
    {
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: '__________________________________________________',
              style: 'footer',
              margin: [0, 30, 0, 0],
              border: [true, false, true, false],
            },
          ],
          [
            {
              text: company,
              style: 'footer',
              margin: [0, 0, 0, 0],
              border: [true, false, true, false],
            },
          ],
          [
            {
              text: dateFormat(),
              style: 'footer',
              margin: [0, 0, 0, 20],
              border: [true, false, true, true],
            },
          ],
        ],
      },
    },
  ];

  return docFooter;
}

export default docFooter;
