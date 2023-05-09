export default {
  options(h, conf, key) {
    const list = []
    conf.options.forEach(item => {
      list.push(<a-mentions-option value={item.value}> {item.label} </a-mentions-option>)
    })
    return list
  }
}
