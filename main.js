import { Item } from './assets/classes/item.js'

// TODO 3 - Separar as funções em arquivos JS
// Onde as tarefas serão exibidas!
const containerTarefas = document.querySelector('.lista-de-tarefas')

// Onde as tarefas serão inseridas!
let listaDeTarefas = baixarLista()
console.log(listaDeTarefas)

// Captura de informações do user
const descricao = document.querySelector('#input-tarefa')
const data = document.querySelector('#input-date')
const prioridade = document.querySelector('#select-options')
const formulario = document.querySelector('form')
const btnForm = document.querySelector('#btn-form')

// Adição de uma nova tarefa
btnForm.addEventListener('click', e => {
  // Previne o submit do form
  e.preventDefault()

  // Cria novos objetos e manda para função que cria eles

  const formValido =
    descricao.value != '' && data.value != '' && prioridade.value != ''

  if (formValido) {
    let tarefa = new Item(descricao.value, data.value, prioridade.value)
    // Adiciona tarefa no array
    listaDeTarefas.push(tarefa)

    // Salva lista
    salvarLista()

    // Cria elemento na página
    renderTarefa(tarefa.descricao, tarefa.data, tarefa.prioridade, tarefa.id)

    // Limpar formulário
    limparForm()

    console.log(listaDeTarefas)
  } else {
    alert('Preencher todos os campos')
  }
})

function salvarLista() {
  let listaString = JSON.stringify(listaDeTarefas)
  localStorage.setItem('lista de tarefas', listaString)
}

function baixarLista() {
  let listaString = localStorage.getItem('lista de tarefas')
  // Transforma a lista de string para array novamente
  return JSON.parse(listaString) || []
}

function carregarTarefas() {
  listaDeTarefas.map(tarefas => {
    renderTarefa(
      tarefas.descricao,
      tarefas.data,
      tarefas.prioridade,
      tarefas.id
    )
  })
}

function limparForm() {
  descricao.value = ''
  data.value = ''
  prioridade.value = ''
}

function editarTarefa(id) {

  // Criando Btn Atualizar
  const btnAtualizar = document.createElement('button')
  btnAtualizar.innerText = 'Atualizar'
  btnAtualizar.setAttribute('id', 'btnAtualizar')
  // Criando Btn Cancelar
  const btnCancelar = document.createElement('button')
  btnCancelar.setAttribute('id', 'btnEditar')
  btnCancelar.innerText = 'Cancelar'

  const btnAtualizarExiste = document.querySelector('form > #btnAtualizar')

  if (!btnAtualizarExiste) {
    // Desativando o btn de adicionar tarefas
    btnForm.setAttribute('disabled', true)
    // Inserindo os btns dentro do form
    formulario.appendChild(btnAtualizar)
    formulario.appendChild(btnCancelar)
  }

  btnAtualizar.addEventListener('click', () => {
    const formValido =
      descricao.value != '' && data.value != '' && prioridade.value != ''

    if (formValido) {
      // Seleciono oq for inserido no form
      const descricaoEditada = document.querySelector('#input-tarefa').value
      const dataEditada = document.querySelector('#input-date').value
      const prioridadesEditada = document.querySelector('#select-options').value

      // Atuliza os valores dentro do array
      listaDeTarefas.forEach(tarefa => {
        if (tarefa.id === id) {
          tarefa.descricao = descricaoEditada
          tarefa.data = dataEditada
          tarefa.prioridade = prioridadesEditada
        }
      })

      // Atualizo o array
      salvarLista()

      // Apaga tarefa antiga
      const tarefaAntiga = document.getElementById(`item:${id}`)
      tarefaAntiga.remove()

      //  Insere tarefa editada na página
      renderTarefa(descricaoEditada, dataEditada, prioridadesEditada, id)

      // Remove botões
      btnAtualizar.remove()
      btnCancelar.remove()

      // Ativa novemnte o btn do form
      btnForm.removeAttribute('disabled')

      limparForm()
    } else {
      alert('Preencha todos os campos para editar a tarefa!')
    }
  })

  btnCancelar.addEventListener('click', () => {
    btnAtualizar.remove()
    btnCancelar.remove()
    btnForm.removeAttribute('disabled')
  })
}

function excluirTarefa(id) {
  // 1- Exclui tarefa do array de tarefas -> Pegando a lista e passando um filter
  listaDeTarefas = listaDeTarefas.filter(tarefas => {
    return tarefas.id !== id
  })

  // Atualiza Lista no localStorange
  salvarLista()

  // Seleciona o item pelo ID e remove da página
  const itemRemovido = document.getElementById(`item:${id}`)
  itemRemovido.remove()
}

function renderTarefa(descricao, data, prioridade, id) {
  // 1 - Nova tarefa com ID único
  let novaTarefa = document.createElement('li')
  novaTarefa.setAttribute('class', 'tarefa')
  novaTarefa.id = `item:${id}`

  // 2 - Cria elementos que compõem a tarefa! (li)

  // Checkbox
  const divForm = document.createElement('div')
  const inputCheck = document.createElement('input')
  inputCheck.type = 'checkbox'
  inputCheck.id = id

  // Discrição da tarefa
  const descricaoTarefa = document.createElement('label')
  descricaoTarefa.setAttribute('for', id)
  descricaoTarefa.innerText = descricao

  // Add input + descrição no Div
  divForm.appendChild(inputCheck)
  divForm.appendChild(descricaoTarefa)

  // Data e prioridade
  const prioridadeTarefa = document.createElement('p')
  prioridadeTarefa.innerText = prioridade

  const dataTarefa = document.createElement('p')
  dataTarefa.innerText = data

  // Botões e escutadores!
  const btnEditar = document.createElement('button')
  btnEditar.setAttribute('class', 'btnTarefa')
  btnEditar.innerText = 'Editar'

  btnEditar.addEventListener('click', () => {
    editarTarefa(id)
  })

  const btnExcluir = document.createElement('button')
  btnExcluir.setAttribute('class', 'btnTarefa')
  btnExcluir.innerText = 'Excluir'

  btnExcluir.addEventListener('click', () => {
    excluirTarefa(id)
  })

  // 3 - Adiciona elementos no li inicial
  novaTarefa.appendChild(divForm)
  novaTarefa.appendChild(prioridadeTarefa)
  novaTarefa.appendChild(dataTarefa)
  novaTarefa.appendChild(btnEditar)
  novaTarefa.appendChild(btnExcluir)

  // 4 - Exibe na página
  containerTarefas.appendChild(novaTarefa)
}

carregarTarefas() // Carrega as tarefas na página

// TODO 2 - Criar estilo para quando a tarefa for concluida!

// Salvar checked
document.addEventListener('click', e => {
  let el = e.target.type
  console.log(el)

  if (el === 'checkbox') {
    console.log('tarefa concluida')
  }
})
