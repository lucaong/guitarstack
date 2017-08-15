module.exports = {
  dragStart: function(e) {
    e.dataTransfer.setData(this.props.id, "")
  },
  dragOver: function(e) {
    e.preventDefault()
    const draggedId = e.dataTransfer.types[0]
    if (draggedId != this.props.id) {
      this.props.swapGadgets(this.props.id, draggedId)
    }
  },
  drop: function(e) {
    this.props.rewireEffects()
  }
}
