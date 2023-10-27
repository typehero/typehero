type ApiRequest<Data, Method = 'GET'> = {
  data: Data;
  method: Method;
};

type TSConfig<Config extends { strict: boolean } = { strict: true }> = {
  strict: Config['strict'];
};
