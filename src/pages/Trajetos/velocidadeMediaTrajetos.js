import React, { Component, Fragment } from "react";
import Dimensions from "react-dimensions";
import { withRouter } from "react-router-dom";
import NavBar from "../NavBar/navbar";
import { withGlobalState } from 'react-globally'
import api from "../../services/api";
import api_radares from "../../services/api_radares";
import { Container, HeaderLine } from "./style";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Swal from 'sweetalert2'


const ColoredLine = ({ color }) => (
    <div
        style={{
            marginBottom: 8,
            color: color,
            backgroundColor: color,
            opacity: 0.2,
            height: 2
        }}
    />
);



class VelocidadeMediaTrajetoPage extends Component {
    state = {
        data: [],
        totalElements: 0,
        loading: false
    };

    getUsuarioLogado = async e => {
        try {
            const respose = await api.get("api/usuarios/usuario-autenticado");
            this.props.setGlobalState(prevGlobalState => ({
                usuario: respose.data
            }))
        } catch (err) {
            if (err.response.data.status === 429 || err.response.data.status === 500) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.response.data.message
                })
            } else {
                this.props.history.push("/logout");

            }
        }
    };

    getAllLocalizacao = async (page) => {
        try {
            const response = await api_radares.get("api/trajetos/velocidades?page=" + page + "&size=10");
            console.log(response.data.totalElements)
            this.setState({
                data: response.data.trajetosVelocidadesMediasResponse.content,
                totalElements: response.data.totalElements,
                perPageItemCount: response.data.size,
                loading: false
            });
        } catch (err) {
            console.log(err);
        }
    };

    componentDidMount() {
        if (this.props.globalState.usuario.id === 0)
            this.getUsuarioLogado();
        this.getAllLocalizacao(0);
    }



    render() {
        return (
            <Fragment>
                <NavBar {...this.props} />
                <Container>
                    <HeaderLine>
                        <h2>
                            Tipos de veículos por radar
                        </h2>

                    </HeaderLine>

                    <ColoredLine color='black' />
                    <ReactTable
                        data={this.state.data}
                        columns={[
                            {
                                Header: "Endereço (Destino)",
                                accessor: "enderecoDestino"
                            },
                            {
                                Header: "Endereço (Origem)",
                                accessor: "enderecoOrigem"
                            },
                            {
                                Header: "Primeiro sensor",
                                accessor: "radarOrigem"
                            },
                            {
                                Header: "Segundo sensor",
                                accessor: "radarDestino"
                            },
                            {
                                Header: "Velocidade Inical",
                                accessor: "velocidadeOrigem"
                            },
                            {
                                Header: "Velocidade Final",
                                accessor: "velocidadeDestino"
                            },
                            {
                                Header: "Velocidade Média",
                                accessor: "velocidadeMedia"
                            },

                        ]}
                        defaultPageSize={10}
                        pages={parseInt(this.state.totalElements / 10, 10) + 1}
                        className="-striped -highlight"
                        loading={this.state.loading}
                        showPagination={true}
                        showPaginationTop={false}
                        showPaginationBottom={true}
                        showPageSizeOptions={false}
                        previousText='Voltar'
                        nextText='Próximo'
                        loadingText='Carregando...'
                        noDataText='Nenhum dado encontrado'
                        pageText='Página'
                        ofText='de'
                        rowsText='linhas'
                        manual
                        onPageChange={(pageIndex) => {
                            this.setState({ loading: true });
                            this.getAllLocalizacao(pageIndex)
                        }}

                    />

                </Container>
            </Fragment>
        );
    }
}

const VelocidadeMediaTrajetoPageConst = withGlobalState(withRouter(Dimensions()(VelocidadeMediaTrajetoPage)));
const VelocidadeMediaTrajeto = () => (
    <Fragment>
        <VelocidadeMediaTrajetoPageConst />
    </Fragment>

);

export default VelocidadeMediaTrajeto;
