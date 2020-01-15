import { blue1 } from './modules/variables';

export default {
    '@global': {
        '*': {
            boxSizing: 'border-box',
        },
        body: {
            fontFamily: 'Roboto, "Helvetica Neue", sans-serif',
        },
        input: {
            '&:-webkit-autofill' :{
                '-webkit-box-shadow' : '0 0 0 1000px white inset',
            }
        },
        a: {
            textDecoration: 'none',
            color: blue1,
            '&:hover': {
                textDecoration: 'underline',
            }
        }
    }
}