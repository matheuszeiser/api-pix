if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const axios = require("axios")
const fs = require('fs')
const path = require("path")
const https = require("https")

const cert = fs.readFileSync(
    path.resolve(__dirname, `../certs/${process.env.GN_CERT}`)
)

const agent = new https.Agent({
    pfx: cert,
    passphrase: ""
})

const credentials = Buffer.from(`${process.env.GN_CLIENT_ID}:${process.env.GN_CLIENT_SECRET}`).toString("base64")

axios({
    method: "POST",
    url: `${process.env.GN_ENDPOINT}/oauth/token`,
    headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json"
    },
    httpsAgent: agent,
    data: {
        grant_type: "client_credentials"
    }
}).then((response) => {
    const accessToken = response.data?.access_token;

    const reqGN = axios.create({
        baseURL: process.env.GN_ENDPOINT,
        httpsAgent: agent,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        }
    })

    const dataCob = {
        calendario: {
            expiracao: 3600
        },
        valor: {
            original: "100.00"
        },
        chave: "1d3a3370-e648-4c18-bf13-1b75721a5425",
        solicitacaoPagador: "Paga ai troxa."
    }

    reqGN.post("/v2/cob", dataCob).then((response) => console.log(response.data))
})


// curl --request POST \
//   --url https://api-pix-h.gerencianet.com.br/oauth/token \
//   --header 'Authorization: Basic Q2xpZW50X0lkXzViZTAxODBhODA3OTAzZDkxNTEzODhmYjEyOWI0ODhjNDYwZDcyOTQ6Q2xpZW50X1NlY3JldF80OGYxZjgwMmM0NmRlYTk0ZTYwNjc4MmZmNzBjMGNiMGVhMDllMTUy' \
//   --header 'Content-Type: application/json' \
//   --data '{
// 	"grant_type" : "client_credentials"
// }'