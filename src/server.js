if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const express = require("express")
const GNRequest = require('./apis/gerencianet')


const app = express()

app.set("view engine", "ejs")
app.set("views", "src/views")

const reqGNAlready = GNRequest({
    clientId: process.env.GN_CLIENT_ID,
    clientSecret: process.env.GN_CLIENT_SECRET
});

app.get("/", async (req, res) => {
    const reqGN = await reqGNAlready
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

    const cobResponse = await reqGN.post("/v2/cob", dataCob)

    // res.send(cobResponse.data)

    const qrcodeResponse = await reqGN.get(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)

    // res.send(qrcodeResponse.data)
    res.render('qrcode', { qrcodeImage: qrcodeResponse.data.imagemQrcode })
})
app.get("/cobrancas", async (req, res) => {
    const reqGN = await reqGNAlready

    const cobResponse = await reqGN.get("/v2/cob?inicio=2022-10-10T16:01:35Z&fim=2022-11-30T20:10:00Z")

    res.send(cobResponse.data)
})
app.listen(8000, () => {
    console.log("running")
})
