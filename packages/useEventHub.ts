import mitt from 'mitt';

const eventHub = mitt();

export default () => eventHub;
