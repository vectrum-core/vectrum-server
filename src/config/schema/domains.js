const isProduction = process.env.NODE_ENV === 'production';



const schema = {
  domains: {
    root: {
      doc: 'Root domain',
      format: String,
      default: isProduction ? 'https://vectrum.group' : 'http://localhost:3001',
    },
    api: {
      doc: 'API domain',
      format: String,
      default: isProduction ? 'https://vectrum.group' : 'http://localhost:3001',
    },
  },
};

module.exports = schema;
