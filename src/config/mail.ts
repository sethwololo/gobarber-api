interface IMailConfig {
  driver: 'ethereal' | 'ses';

  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',

  defaults: {
    from: {
      email: 'sethwololo@gmail.com',
      name: 'Sethwololo GoBarber',
    },
  },
} as IMailConfig;
