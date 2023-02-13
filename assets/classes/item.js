export class Item {
  descricao
  data
  prioridade
  id
  concluida

  constructor(descricao, data, prioridade) {
    this.descricao = descricao
    this.data = data
    this.prioridade = prioridade
    this.id = Math.floor(Math.random() * 987654 * descricao.length + 1)
    this.concluida = false
  }
}
