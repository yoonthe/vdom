import RenderInterface from './interface/RenderInterface';

const config = {
  render: new RenderInterface()
};
/**
 * setRender
 * @param {Renderinterface} render 
 * @returns {Boolean} scsFlag
 */
export const setRender = render => {
  if (render instanceof RenderInterface) {
    config.render = render;
    return true;
  } else {
    return false;
  }
}

/**
 * getRender
 * @returns {RenderInterface} render
 */
export const getRender = () => config.render;