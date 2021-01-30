<template>
  <div class="page-wrapper max-container">
    <h1 class="intro-text"><span class="is-f">féminin</span> ou <span class="is-m">masculin</span> ?</h1>

    <form action="" method="" accept-charset="utf-8" @submit="evaluateWord">
      <div class="input-row">
        <input v-model="word" type="text" required />

        <svg xmlns="http://www.w3.org/2000/svg" class="icon-search" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="10" cy="10" r="7" />
          <line x1="21" y1="21" x2="15" y2="15" />
        </svg>
      </div>
      <div class="results">
        <span class="result-f" :class="{ 'is-active': result && result.kind === 'féminin' }">F</span>
        <span class="result-m" :class="{ 'is-active': result && result.kind === 'masculin' }">M</span>
      </div>
    </form>

    <div class="results-helper">
      <div v-if="isLoading" class="loader-wrapper">
        <svg class="loader" width="38" height="38" xmlns="http://www.w3.org/2000/svg" stroke="#596778">
          <g transform="translate(1 1)" stroke-width="2" fill="none" fill-rule="evenodd">
            <circle stroke-opacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18">
              <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite" />
            </path>
          </g>
        </svg>
      </div>
      <p v-else-if="!isLoading && result">
        {{ word }} est
        <span
          :class="{
            'is-f': result && result.kind === 'féminin',
            'is-m': result && result.kind === 'masculin'
          }"
        >
          {{ result.kind }}
        </span>
      </p>
      <p v-else-if="word && word.length >= 2 && !result"><span>Entrer</span> pour voir le résultat</p>
      <p v-else-if="error">
        {{ error }}
      </p>
      <p v-else>Recherchez un mot. Ex: <span>Article</span></p>
    </div>

    <p class="copyrights">
      Fait avec
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 261.76 226.69">
        <g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)">
          <g transform="translate(178.06 235.01)">
            <path d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" fill="#41b883" />
          </g>
          <g transform="translate(178.06 235.01)">
            <path d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" fill="#34495e" />
          </g>
        </g>
      </svg>
      +
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
        <title>file_type_firebase</title>
        <path d="M5.8,24.6l.17-.237L13.99,9.149l.017-.161L10.472,2.348a.656.656,0,0,0-1.227.207Z" style="fill:#ffc24a"></path>
        <path d="M5.9,24.42l.128-.25L13.965,9.114,10.439,2.448a.6.6,0,0,0-1.133.206Z" style="fill:#ffa712"></path>
        <path d="M16.584,14.01l2.632-2.7L16.583,6.289a.678.678,0,0,0-1.195,0L13.981,8.971V9.2Z" style="fill:#f4bd62"></path>
        <path d="M16.537,13.9l2.559-2.62L16.537,6.4a.589.589,0,0,0-1.074-.047L14.049,9.082l-.042.139Z" style="fill:#ffa50e"></path>
        <polygon points="5.802 24.601 5.879 24.523 6.158 24.41 16.418 14.188 16.548 13.834 13.989 8.956 5.802 24.601" style="fill:#f6820c"></polygon>
        <path
          d="M16.912,29.756,26.2,24.577,23.546,8.246A.635.635,0,0,0,22.471,7.9L5.8,24.6l9.233,5.155a1.927,1.927,0,0,0,1.878,0"
          style="fill:#fde068"
        ></path>
        <path d="M26.115,24.534,23.483,8.326a.557.557,0,0,0-.967-.353L5.9,24.569l9.131,5.1a1.912,1.912,0,0,0,1.863,0Z" style="fill:#fcca3f"></path>
        <path
          d="M16.912,29.6a1.927,1.927,0,0,1-1.878,0L5.876,24.522,5.8,24.6l9.233,5.155a1.927,1.927,0,0,0,1.878,0L26.2,24.577l-.023-.14Z"
          style="fill:#eeab37"
        ></path>
      </svg>
      par
      <a href="http://jnv.dev/" target="_blank" rel="noreferer noopener">Vincent Bourdeau</a>
    </p>

    <p class="thanks">
      Merci à
      <a href="https://Larousse.fr/dictionnaires/francais/" target="_blank" rel="noreferer noopener">Larousse.fr</a>
    </p>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { functions } from '@/firebase/init'
import { formatWord } from '@/misc/helpers'
import WordsDB from '@/firebase/words-db'

export default {
  data: () => ({ isLoading: true, word: '', wordsList: null, error: '' }),
  head() {
    return {
      title: {
        inner: `C'est mon genre!`
      },
      meta: [
        {
          name: 'description',
          content: `Quel est le genre du mot...`,
          id: 'desc'
        }
      ]
    }
  },
  computed: {
    result() {
      if (!this.word || this.word.length <= 2) {
        return null
      }

      const word = formatWord(this.word)

      // Check if word exists
      const wordExists = this.wordsList.find(i => i.id === word)

      if (!wordExists) {
        return null
      }

      return wordExists
    },
    ...mapState('app', ['appTitle'])
  },
  mounted() {
    this.fetchExistingWords()
  },
  methods: {
    async fetchExistingWords() {
      const wordsDB = new WordsDB()
      this.wordsList = await wordsDB.readAll()
      this.isLoading = false
    },
    async evaluateWord(e) {
      e.preventDefault()

      if (this.isLoading) {
        return
      }

      if (this.word && this.result) {
        return
      }

      if (this.word && this.word.length = 2) {
        return
      }

      if (!this.word) {
        return
      }

      this.isLoading = true

      this.word = formatWord(this.word)

      try {
        const getResultFromLarousse = functions.httpsCallable('getResultFromLarousse')
        const result = await getResultFromLarousse({ word: this.word })
        this.wordsList.push({
          id: this.word,
          kind: result.data
        })
      } catch (err) {
        this.word = ''
        this.error = `Ce mot ne semble pas exister. Veuillez verifier l'orthographe et essayer de nouveau`
        this.isLoading = false

        setTimeout(() => {
          this.error = ''
        }, 5000)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/theme/variables.scss';

.page-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  flex-direction: column;
}

.logo-wrapper {
  text-align: center;

  svg {
    display: inline-block;
    width: 100%;
    max-width: 70px;
    padding: 35px 0;
  }
}

form {
  display: flex;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 16px;
  background: #fffeff;
  border-radius: 12px;
  box-shadow: -2px 2px 6px rgb(237, 237, 237);

  .input-row {
    position: relative;
    width: 100%;

    .icon-search {
      position: absolute;
      top: 50%;
      left: 10px;
      z-index: 1;

      width: 20px;

      transform: translate(0, -50%);

      stroke: #596778;
      stroke-width: 2;

      opacity: 0.9123;
    }
  }

  input {
    width: 100%;
    background: #f1f1f7;
    border: 1px solid #f1f1f7;
    outline: none;
    border-radius: 6px;
    font-size: 0.9145rem;
    padding: 10px 8px 10px 35px;
    color: #596778;
    font-weight: 100;

    transition: border-color 0.65s ease 0s;

    &:focus {
      border: 1px solid rgba(#596778, 0.15);
    }
  }

  .results {
    display: flex;
    align-items: center;
    justify-content: space-between;

    border-radius: 6px;
    font-size: 0.945rem;
    padding: 0 0 0 10px;

    span {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 30px;
      height: 30px;

      border-radius: 50%;
      margin-left: 10px;
      text-align: center;
      color: #596778;
      font-weight: 600;
      font-size: 0.745rem;

      background: rgba(#f1f1f7, 0.75);
    }

    .result-f {
      &.is-active {
        background: rgba(#ea4972, 0.75);
        color: #fff;
      }
    }

    .result-m {
      &.is-active {
        background: rgba(#3887f0, 0.75);
        color: #fff;
      }
    }
  }
}

.results-helper,
.intro-text {
  margin: 0;
  padding: 20px 10px;
  color: #596778;
  font-weight: 500;
  font-size: 0.745rem;

  span {
    border-radius: 12px;
    text-align: center;
    color: #596778;
    font-weight: 600;
    font-size: 0.745rem;
    padding: 4px 8px;

    background: rgba(#f1f1f7, 0.75);

    &.is-f {
      background: rgba(#ea4972, 0.75);
      color: #fff;
    }

    &.is-m {
      background: rgba(#3887f0, 0.75);
      color: #fff;
    }
  }

  p {
    text-align: center;
  }
}

.intro-text {
  margin-bottom: 10px;
}

.loader-wrapper {
  text-align: center;
}

.copyrights,
.thanks {
  color: #596778;
  font-weight: 400;
  font-size: 0.745rem;
  opacity: 0.5;

  width: 100%;
  text-align: center;

  @media (min-width: 500px) {
    width: auto;
    text-align: left;
  }

  a {
    color: inherit;
  }

  svg {
    position: relative;
    top: 5px;
    width: 20px;
  }
}

.copyrights {
  position: fixed;
  left: 0;
  bottom: 30px;

  margin: 0;
  padding: 20px;
  line-height: 1;

  @media (min-width: 500px) {
    bottom: 0;
  }
}

.thanks {
  position: fixed;
  right: 0;
  bottom: 0;

  margin: 0;
  padding: 20px;
  line-height: 1;
}
</style>
