const functions = require('firebase-functions')
const admin = require('firebase-admin')
const puppeteer = require('puppeteer')
const cors = require('cors')({ origin: true })

const serviceAccount = require('./feminin-masculin-firebase-adminsdk-bmz4n-14b2ae9442.json')

const runtimeOpts = {
  timeoutSeconds: 500,
  memory: '1GB'
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://feminin-masculin.firebaseio.com',
  storageBucket: 'feminin-masculin.appspot.com'
})

const browserScraper = async word => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox']
  })

  const page = await browser.newPage()

  await page.goto(`https://www.larousse.fr/dictionnaires/francais/${word}/`, {
    waitUntil: 'load',
    timeout: 0
  })

  const data = await page.evaluate(() => {
    return document.querySelector('p.CatgramDefinition')
      ? document
          .querySelector('p.CatgramDefinition')
          .textContent.replace('nom ', '')
          .replace(' (Réf. ortho. adjectif)', '')
      : null
  })

  await browser.close()

  return data
}

exports.getResultFromLarousse = functions.runWith(runtimeOpts).https.onRequest((request, response) => {
  cors(request, response, async () => {
    let word = request.body.data

    if (!word) {
      response.status(500).send({ data: 'No Word provided Err' })
      return false
    }

    word = word.toLowerCase()

    const data = await browserScraper(word)

    if (!data) {
      response.status(500).send({ data: 'No result Err' })
      return false
    }

    const db = admin.firestore()

    db.collection('words')
      .doc(word)
      .set({
        kind: data,
        updateTimestamp: new Date(),
        createTimestamp: new Date()
      })

    response.status(200).send({ data })
    return true
  })
})
