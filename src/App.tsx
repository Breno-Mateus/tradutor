import { useEffect, useState } from "react";
import { GoArrowSwitch } from "react-icons/go";
import axios from 'axios'

const languages = [
  { code: 'en', name: 'Inglês' },
  { code: 'es', name: 'Espanhol' },
  { code: 'fr', name: 'Francês' },
  { code: 'de', name: 'Alemão' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
]

function App() {

  const [sourceLang, setSourceLang] = useState('pt')
  const [targetLang, setTargetLang] = useState('en')
  const [sourceText, setSourceText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [translatedText, setTranslatedText] = useState('')
  const [error, setError] = useState('')


  useEffect(() => {

    if(sourceText){
      
      const delay = setTimeout(() => {
        handleTranslate()
      }, 300)

      return () => clearTimeout(delay)
    }
    

  }, [sourceText, targetLang, sourceLang])

  const handleTranslate = async () => {
  
    setIsLoading(true)
    setError('')

    try {
      const response = await axios.get(`https://api.mymemory.translated.net/get?q=${sourceText}&langpair=${sourceLang}|${targetLang}`)

      setTranslatedText(response.data.responseData.translatedText)
    } catch (error: unknown) {
        if (error instanceof Error) {
          setError(`Erro ao tentar traduzir: ${error.message}. Tente novamente.`);
        } else {
          setError('Erro desconhecido ao tentar traduzir. Tente novamente.');
        }
    } finally {
      setIsLoading(false)
    }
  }


  const swapTranslate = () => {
    setSourceLang(targetLang)
    setTargetLang(sourceLang)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
          <h1 className="text-headerColor text-2xl font-bold">Tradutor</h1>
        </div>
      </header>

      <main className="flex-grow flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <select value={sourceLang}  onChange={event => setSourceLang(event.target.value)} className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer">
              {languages.map( (lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <button className="p-2 rounded-full hover:bg-gray-100 outline-none" onClick={swapTranslate}><GoArrowSwitch /></button>

            <select value={targetLang} onChange={event => setTargetLang(event.target.value)} className="text-sm text-textColor bg-transparent border-none focus:outline-none cursor-pointer">
              {languages.map( (lang) => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4">
              <textarea value={sourceText} onChange={event => setSourceText(event.target.value)} placeholder="Digite seu texto..." className="w-full h-40 text-lg text-textColor bg-transparent resize-none border-none outline-none"></textarea>
            </div>

            <div className="p-4 relative bg-secondaryBackground border-l border-gray-200">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                </div>
              ) : (
                <p className="text-lg text-textColor">{translatedText}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-100 border-t border-red-400 text-red-700">{error}</div>
          )}

        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-5xl mx-auto px-4 py-3 text-sm text-headerColor">
              &copy; {new Date().getFullYear()} Breno Mateus
        </div>
      </footer>
    </div>
  )
}

export default App