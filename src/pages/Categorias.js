import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Toast from 'react-bootstrap/Toast'

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import { BACKEND } from '../constants'

import { MdRestaurantMenu, MdWeb, MdSave, MdModeEdit, MdDelete, MdCancel } from 'react-icons/md'

const Categorias = () => {
    const valorInicial = { nome: '', status: true }

    const [categoria, setCategoria] = useState(valorInicial)
    const [categorias, setCategorias] = useState([])
    const [carregandoCategorias, setCarregandoCategorias] = useState(false)
    const [salvandoCategorias, setSalvandoCategorias] = useState(false)
    const [confirmaExclusao, setConfirmaExclusao] = useState(false)

    const [aviso, setAviso] = useState('')
    const [erros, setErros] = useState({})

    const { nome, status } = categoria

    async function obterCategorias() {
        setCarregandoCategorias(true)
        let url = `${BACKEND}/categorias`
        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCategorias(data)
                console.log(data)
            })
            .catch(function (error) {
                console.error(`Erro ao obter as categorias: ${error.message}`)
            })
        setCarregandoCategorias(false)

    }

    useEffect(() => {
        document.title = 'Cadastro de Categorias'
        obterCategorias()
    }, [])

    const validaErrosCategoria = () => {
        const novosErros = {}
        //Validação de Nome
        if (!nome || nome === '') novosErros.nome = 'O nome não pode ser vazio'
        else if (nome.length > 30) novosErros.nome = 'O nome informado é muito longo'
        else if (nome.length < 3) novosErros.nome = 'O nome informado é muito curto'
        return novosErros
    }

    const alteraDadosCategoria = e => {
        setCategoria({ ...categoria, [e.target.name]: e.target.value })
        setErros({})
    }

    async function salvarCategoria(e) {
        e.preventDefault() // evita que a página seja recarregada  
        const novosErros = validaErrosCategoria()
        //Existe algum erro no array?
        if (Object.keys(novosErros).length > 0) {
            //Sim, temos erros!
            setErros(novosErros)
        } else {
            const metodo = categoria.hasOwnProperty('_id') ? 'PUT' : 'POST'
            categoria.status = (categoria.status === true || categoria.status === 'ativo') ? 'ativo' : 'inativo'
            setSalvandoCategorias(true)
            let url = `${BACKEND}/categorias`
            await fetch(url, {
                method: metodo,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(categoria)
            }).then(response => response.json())
                .then(data => {
                    (data._id || data.message) ? setAviso('Registro salvo com sucesso') : setAviso('')
                    setCategoria(valorInicial) //limpa a tela
                    obterCategorias()
                }).catch(function (error) {
                    console.error(`Erro ao salvar a categoria: ${error.message}`)
                })
            setSalvandoCategorias(false)
        }
    }

    async function excluirCategoria() {
        let url = `${BACKEND}/categorias/${categoria._id}`
        await fetch(url, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(data => {
                data.message ? setAviso(data.message) : setAviso('')
                setCategoria(valorInicial)
                obterCategorias()
            })
            .catch(function (error) {
                console.error(`Erro ao excluir a categoria: ${error.message}`)
            })
    }

    return (
        <>
            <Container fluid className="p-0">
                <Cabecalho />
                <Row className="bg-info text-light">
                    <Col>
                        <h3><MdRestaurantMenu /> Categorias de Restaurantes</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} lg={6}>
                        {/* Formulário das Categorias */}
                        <h4><MdWeb /> Cadastro das Categorias</h4>
                        <Form method="post">
                            <Form.Group controlId="nome">
                                <Form.Label>Nome da Categoria</Form.Label>
                                <Form.Control
                                    name="nome"
                                    placeholder="Ex: Churrascarias"
                                    onChange={alteraDadosCategoria}
                                    value={nome}
                                    isInvalid={!!erros.nome}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    {erros.nome}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="status">
                                <Form.Check type="checkbox" label="Ativo" name="status"
                                    onChange={(e) => setCategoria({ ...categoria, [e.target.name]: e.target.checked })}
                                    checked={status} />
                            </Form.Group>
                            <Button variant="primary" type="submit" title="Salvar o registro"
                                onClick={(e) => salvarCategoria(e)}>
                                {salvandoCategorias
                                    ? <Spinner animation="border" size="sm" />
                                    : <MdSave />
                                }
                                Salvar
                            </Button>
                            &nbsp;
                            <Button variant="danger" type="button" title="Cancelar"
                            onClick={()=> setCategoria(valorInicial)}>
                                <MdCancel/> Cancelar
                            </Button>
                        </Form>
                    </Col>
                    <Col xs={12} lg={6}>
                        {/* Listagem das Categorias */}
                        {carregandoCategorias &&
                            <>
                                <Spinner animation="border" size="sm" />
                                <Spinner animation="grow" variant="info" />
                                <p>Aguarde, enquanto as categorias são carregadas...</p>
                            </>
                        }
                        <Table striped bordered hover>
                            <thead>
                                <tr className="bg-warning text-dark">
                                    <th>Nome</th>
                                    <th>Status</th>
                                    <th>Inclusão</th>
                                    <th>Opções</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.nome}</td>
                                        <td>{item.status}</td>
                                        <td>{item.createdAt}</td>
                                        <td>
                                            <Button variant="outline-primary" title="Editar o registro"
                                                onClick={() => setCategoria(item)}>
                                                <MdModeEdit />
                                            </Button>
                                            &nbsp;
                                            <Button variant="outline-danger" title="Apagar o registro"
                                                onClick={() => {
                                                    setCategoria(item)
                                                    setConfirmaExclusao(true)
                                                }} >
                                                <MdDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                <tr className="bg-dark text-light">
                                    <td colspan="3">Total de Registros:</td>
                                    <td>{categorias.length}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                </Row>
                <Modal animation={false} show={confirmaExclusao} onHide={() => setConfirmaExclusao(false)}>
                    <Modal.Header>
                        <Modal.Title>Confirmação da Exclusão</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirma a exclusão da categoria selecionada?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={() => setConfirmaExclusao(!confirmaExclusao)}>
                            ❌Cancelar
                            </Button>
                        <Button variant="success"
                            onClick={() => {
                                setConfirmaExclusao(!confirmaExclusao)
                                excluirCategoria()
                            }}>
                            ✔️Confirmar
                            </Button>
                    </Modal.Footer>
                </Modal>

                <Toast
                    onClose={() => setAviso('')}
                    show={aviso.length > 0}
                    animation={false}
                    delay={4000}
                    autohide
                    className="bg-success"
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10
                    }}>
                    <Toast.Header>Aviso</Toast.Header>
                    <Toast.Body classname="text-light">{aviso}</Toast.Body>
                </Toast>

                <Rodape />
            </Container>
        </>
    )
}

export default Categorias