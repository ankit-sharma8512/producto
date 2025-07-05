import moment from "moment";

const CODE_LEN = 8;
const CHARSET = '1234567890';

export function generateUID() {
  // eslint-disable-next-line no-unused-vars
  const code = Array(CODE_LEN).fill(0).map(_ => CHARSET.at(Math.random() * CHARSET.length)).join('');
  const month = moment().format('MM') + '-' + moment().format('YY')

  return ['ST', month, code].join('/')
}