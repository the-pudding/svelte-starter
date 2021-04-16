/**
 * This action lets you dynmically change value of CSS variable
 * example:
 * <p use:css={{ color }} >Hi</p>
 * 
 * in your style tag:
 * p {
 *   color: var(--color);
 * }
 */

export default function css(node, properties) {
  function setProperties() {
    if (properties) {
      for (const prop of Object.keys(properties)) {
        node.style.setProperty(`--${prop}`, properties[prop]);
      }
    }
  }

  setProperties();

  return {
    update(newProperties) {
      properties = newProperties;
      setProperties();
    },
  };
}