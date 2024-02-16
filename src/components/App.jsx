import { Component } from 'react';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button';
import Loader from './Loader';
import Modal from './Modal';

const API_KEY = '35199241-1ce149cef2c4e9fde3ee4bd95';
const URL = 'https://pixabay.com/api/';
const bodyEl = document.querySelector('body')
export class App extends Component{
  state = {
    query: '',
    response: null,
    totalHits: null,
    page: 1,
    error: null,
    loading: false,
    showModal: false,
    currentId: null,
  }

  componentDidUpdate(prevProps, prevState) { 
    const { query, page } = this.state;
    if (prevState.query !== query) {
      this.setState({ loading: true })
        fetch(`${URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`)
        .then(res => {
          if (res.ok) {
            return res.json()
          }
          return Promise.reject(new Error('Сталась помилка'))
        })
        .then(pictures => {
          if (pictures.hits.length === 0) {
            alert('Нічого не знайдено, спробуйте інший запит');
          } else {
            return (
              this.setState({ response: null }),
              this.setState({ response: pictures.hits, totalHits: pictures.totalHits })
              )
          }
        })
        .catch(error => this.setState({ error }))
        .finally(this.setState({loading: false}))
    } else {
      if (prevState.page !== page) {
        this.setState({ loading: true })
          fetch(`${URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`)
            .then(res => res.json())
            .then(pictures => this.setState(prevState => ({ response: prevState.response.concat(pictures.hits) })))
            .catch(error => this.setState({ error }))
            .finally(this.setState({ loading: false }))
      }
    }
  }

  toggleModal = id => {
    this.setState(({showModal}) => ({
      showModal: !showModal,
      currentId: id,
    }))
    bodyEl.classList.toggle('modal-open');
  }

  handleMore = () => {
    this.setState(({page}) => ({ page: page + 1 }));
  }

  handleSearchbarSubmit = data => {
    this.setState(({query}) => {
      if (query !== data) {
        return ({ query: data, page: 1})
      } 
        return alert ('Це вже знайли, введіть інший запит')
    })
  } 

  

  render() {
    const { response, page, loading, showModal, error, currentId, totalHits } = this.state;
    let selectedPicture = null;
    const totalPages = Math.ceil(totalHits / 12);
    if (currentId !== null && response !== null) {
      selectedPicture = response.find(picture => picture.id === currentId);
    }
    return (
      <>
        {showModal && (
          <Modal onClose={this.toggleModal}>
            <img src={selectedPicture.largeImageURL} alt={selectedPicture.tags} />
          </Modal> )} 
        <Searchbar onSubmit={this.handleSearchbarSubmit} isSubmitting={loading}/>
        {error && <h1>{error.message}</h1>}
        {response && <ImageGallery pictures={response} onClick={this.toggleModal}/>}
        {loading && <Loader/>}
        {response && !loading && totalPages !== page && <Button onClick={this.handleMore} />}
      </>
    )
  }
}