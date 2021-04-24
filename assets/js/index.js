// var produtos = JSON.parse(localStorage.getItem("produtos"));

// if (produtos == null) {
//     produtos = [];
// }
// reescreveLista()

var produtos = []
getTable()

function EscreveMensagemNoConsole(text, e) {
    console.log("Debug, evento do mouse:", text)
    console.log(e.target)
}

function clearErrors() {
    // console.log(evt.target.parentElement.querySelector("em"))
    [...document.querySelectorAll(".form-input em")].forEach((message) => {
        message.classList.add("hidden")
    })
}


function trataFormulario(e) {
    e.preventDefault()
    console.log(e.target.elements)

    if (e.target.elements.nomeMercadoria.value == "") {
        e.target.elements.nomeMercadoria.parentElement.querySelector("em").classList.remove("hidden"); 
        return false;
    }

    if ((e.target.elements.nomeMercadoria.value).toUpperCase() == "PS5") {
        e.target.elements.nomeMercadoria.parentElement.querySelector("em").innerHTML = "Não temos playstation 5!"; 
        e.target.elements.nomeMercadoria.parentElement.querySelector("em").classList.remove("hidden"); 
    }

    if (e.target.elements.valorMercadoria.value <= 0) {
        alert("Preencha um valor de mercadoria válido!")
        return false;
    }

    let novoProduto = {
        nome: e.target.elements.nomeMercadoria.value,
        valor: e.target.elements.valorMercadoria.value,
        tipo: e.target.elements.tipoTransacao.value
    }

    produtos.push(novoProduto)

    localStorage.setItem("produtos", JSON.stringify(produtos))
    reescreveLista()
    document.querySelector("form").reset()
    console.log(produtos)
    return false;

}


function somaExtrato() {
    var total = 0
    for (let index = 0; index < produtos.length; index ++) {
        let valor_a_ser_somado = parseFloat(produtos[index].valor.replace(/\./g, "").replace(/,/g, "."))

        console.log(valor_a_ser_somado)

        if (produtos[index].tipo != "1") {
            valor_a_ser_somado *=  -1
        }

        total += valor_a_ser_somado
    }

    return total
}

function removeItem(evt, index) {
    console.log(evt)
    console.log(index)

    produtos.splice(index, 1)

    localStorage.setItem("produtos", JSON.stringify(produtos))

    reescreveLista()
}


document.getElementById("meuForm").addEventListener('submit', trataFormulario)

function toggleMenu() {
    var menu = document.querySelector(".navbar-menu").classList

    if ([...menu].indexOf("opened") == -1) {
        menu.add("opened")
    } else {
        menu.remove("opened")
    }
}


function applyMask(evt) {
    evt.preventDefault()
    if(["0","1","2","3","4","5","6","7","8","9"].indexOf(evt.key) == -1) {
        // console.log("letra")
    } else { 
        // console.log("1",evt.target.value)

        let value = evt.target.value.replace(/^0,/, "").replace(",","").replace(/\./g, "") + evt.key

        if(value.length <= 2) {
            evt.target.value = "0," +value
            // console.log("2",evt.target.value, value.length, value)
        } else {
            evt.target.value = value.slice(0,-2) + ',' + value.slice(value.length-2,value.length) 
            // console.log("3",evt.target.value, value.length, value, value.slice(0,value.length-2), value.slice(value.length-2,value.length))
        }

        lastIndex = -1
        value = evt.target.value.replace(/^0,[0-9]+/, "").replace(/,[0-9]+$/,"").replace(/\./g, "")
        // console.log(value)
        if (value.length >= 4) {
            valuefinal = [];

            for (let i = value.length; i>=0; i--) {
                if ((value.length-i)%3 == 0 && value.slice(i-3, i)) {
                    valuefinal.push(value.slice(i-3, i))
                    lastIndex=i
                }
            }

            // console.log(valuefinal)
            valufinalstring = valuefinal.reverse().join(".")
            evt.target.value = valufinalstring + "," + evt.target.value.replace(/^[0-9.]+,/, "")

            if (value.slice(0,lastIndex-3)) {
                evt.target.value = value.slice(0,lastIndex-3) + '.' + evt.target.value
            }
            
        }


    }
}

function reescreveLista() {
    document.querySelector(".table-transaction-statement tbody").innerHTML = ""

    for (let i = 0; i < produtos.length; i ++) {
        var tipoTransacao = "-"

        if (produtos[i].tipo=="1") {
            tipoTransacao = "+"
        }
        document.querySelector(".table-transaction-statement tbody").innerHTML += `
            <tr onclick="removeItem(event, ` + i +`)">
                <td class="text-right">` + tipoTransacao +`</td>
                <td class="">` + produtos[i].nome  +`</td>
                <td class="text-right">R$ `+ produtos[i].valor +`</td>
            </tr>
        `

    }

    if (produtos.length == 0) {
        document.querySelector(".table-transaction-statement tbody").innerHTML = `
        <tr class="text-center">
            <td colspan="3" class="text-center"> Por favor, adicione uma nova transação </td>
        </tr>
        `
    }

    let lastIndex = 0
    let valufinalstring = ""
    total = somaExtrato()
    
    //Passa sinal para o texto [LUCRO] ou [PREJUIZO]
    lucro_ou_prejuizo = "[LUCRO]"

    if ( total < 0 ) {
        lucro_ou_prejuizo = "[PREJUÍZO]"
    }

    if (total == 0) {
        lucro_ou_prejuizo = ""
    }
    console.log(total.toFixed(2))
    total_escrito = total.toFixed(2)
    total_escrito = total_escrito.replace("-", "")
    // total_escrito = parseFloat(total_escrito)

    //Logica de milhar
    total_escrito_array = total_escrito.split(".")

    if (total_escrito_array[0].length >= 4) {
        valuefinal = [];

        for (let i = total_escrito_array[0].length; i>=0; i--) {
            if ((total_escrito_array[0].length-i)%3 == 0 && total_escrito_array[0].slice(i-3, i)) {
                valuefinal.push(total_escrito_array[0].slice(i-3, i))
                lastIndex=i
            }
        }

        // console.log(valuefinal)
        valufinalstring = valuefinal.reverse().join(".")
        
    }

    if (total_escrito_array[0].slice(0,lastIndex-3)) {
        valufinalstring = total_escrito_array[0].slice(0,lastIndex-3) + '.' + valufinalstring
    }

    if (!valufinalstring && total_escrito_array[0].length > 0) {
        valufinalstring = total_escrito_array[0]
    }

    total_escrito = "R$ " + valufinalstring + ',' + total_escrito_array[1]

    //Passa valores tratados pro HTML
    // document.getElementById("valor-total").innerHTML = total_escrito.toLocaleString('pt-BR')
    document.getElementById("valor-total").innerHTML = total_escrito
    document.getElementById("lucro_ou_prejuizo").innerHTML = lucro_ou_prejuizo
}

var aluno = "3846"
function salvaDados() {
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    })
    .then(response => response.json())
    .then(responseJson => {
        existe = responseJson.records.filter((record) => {
            if (aluno == record.fields.Aluno) {
                return true
            } 

            return false
        })

        if (existe.length == 0) {
            insereDados()
        } else {
            alteraDados(existe[0].id)
        }
    })
}

function insereDados() {
    var json = JSON.stringify(produtos)

    var body = JSON.stringify({
        "records": [
          {
            "fields": {
              "Aluno": aluno,
              "Json": json
            }
          }
        ]
    })
    
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "POST",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
        },
        body:body
    })
}

function alteraDados(id) {
    var json = JSON.stringify(produtos)

    var body = JSON.stringify({
        "records": [
          {
            "id": id,
            "fields": {
              "Aluno": aluno,
              "Json": json
            }
          }
        ]
    })
    
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        method: "PATCH",
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM",
            "Content-Type" : "application/json"
        },
        body:body
    })
}

function getTable() {
    fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
        headers: {
            Authorization: "Bearer key2CwkHb0CKumjuM"
        }
    })
    .then(response => response.json())
    .then(responseJson => {
        existe = responseJson.records.filter((record) => {
            if (aluno == record.fields.Aluno) {
                return true
            } 

            return false
        })

        console.log(existe)
        if (existe.length == 0) {
            produtos = []
        } else {
            produtos = JSON.parse(existe[0].fields.Json)
        }

        reescreveLista()
    })
}