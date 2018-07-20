const global = {
  width: 1000,
  height: 1000,
  maxR: 350,
  color: {
    red: '#E7465D',
    yellow: '#F5AF5F',
    blue: '#3676BB',
    bgBlue: '#001D2E'
  },
  Props: ['defend', 'heart'],
  Levels: [{
    enemys: ['meteorite', 'meteorite']
  }, {
    enemys: ['meteorite', 'meteorite', 'circle']
  }, {
    enemys: ['meteorite', 'triangle', 'circle']
  }, {
    enemys: ['circle', 'triangle', 'meteorite', 'circle']
  }, {
    enemys: ['circle', 'triangle', 'meteorite', 'circle', 'triangle', 'meteorite']
  }]
};

export default global;
