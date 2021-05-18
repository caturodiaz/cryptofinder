import React, {useEffect, useState} from 'react';
import styled from "@emotion/styled";
import useMoneda from "../hooks/useMoneda";
import useCrypto from "../hooks/useCrypto";
import axios from "axios";
import Error from "./Error";
import PropTypes from "prop-types";


const Button = styled.input`
    margin-top: 20px;
    font-weight: bold;
    font-size: 20px;
    padding: 10px;
    background-color: #66a2fe;
    border: none;
    width: 100%;
    border-radius: 10px;
    color: #fff;
    transition: background-color .3 ease;

    &:hover{
        background-color: #326AC0;
        cursor:pointer;
    }
`;
const Formulario = ({guardarCriptomoneda, guardarMoneda}) => {

    //State del listado de criptomonedas
    const [listacripto, guardarCriptomonedas] = useState([]);

    const [error, guardarError] = useState(false);


    const MONEDAS = [
        {codigo: "USD", nombre: "Dólar americano"},
        {codigo: "ARS", nombre: "Peso argentino"},
        {codigo: "EUR", nombre: "Euro"},
        {codigo: "MXN", nombre: "Peso mexicano"},


    ]

    //useMoneda
        const [moneda, SelectMonedas]  = useMoneda("Elige tu moneda", "", MONEDAS);

    //useCrypto
        const [criptomoneda, SelectCrypto] = useCrypto("Elige tu criptomoneda", "", listacripto)

    //Ejecutar llamado a la API
    useEffect(()=>{
        const consultarAPI = async () =>{
            const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD"

            const resultado = await axios.get(url);
            
            guardarCriptomonedas(resultado.data.Data);
        }
        consultarAPI();
    }, []);

    //Cuando el usuario hace submit}

    const cotizarMoneda = e => {
        e.preventDefault();

        //validar si ambos campos estan llenos
        if (moneda === "" || criptomoneda === ""){
            guardarError(true);
            return;
        }

        //pasar los datos al componente principal
        guardarError(false);
        guardarMoneda(moneda);
        guardarCriptomoneda(criptomoneda);
    }
    return (  
        <form
            onSubmit={cotizarMoneda}
        >
            {error ? <Error mensaje="Todos los campos son obligatorios"/> : null}
            <SelectMonedas/>

            <SelectCrypto/>
            <Button
                type="submit"
                value="Calcular"
            />  
        </form>
    );
}
 
Formulario.propTypes = {
    guardarMoneda: PropTypes.func.isRequired,
    guardarCriptomoneda: PropTypes.func.isRequired,
}
export default Formulario;