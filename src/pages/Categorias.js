import React, { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'

import Cabecalho from '../components/Cabecalho'
import Rodape from '../components/Rodape'
import { BACKEND } from '../constants'

import { MdRestaurantMenu } from 'react-icons/md'

const Categorias = () => {
    const [categorias, setCategorias] = useState([])
    const [carregandoCategorias, setCarregandoCategorias] = useState(false)

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
                        <p>Cadastro</p>
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
                                <tr>
                                    <th>Nome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map(item => (
                                    <tr key={item._id}>
                                        <td>{item.nome}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>

                <Rodape />
            </Container>
        </>
    )
}

export default Categorias