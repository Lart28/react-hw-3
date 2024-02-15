import { Component } from 'react';
import './Searchbar.css';
import PropTypes from 'prop-types';


class Searchbar extends Component {
  state = {
    query: '',
  }

  handleChangeQuery = e => {
    const SearchValue = e.currentTarget.value;
    this.setState({query: SearchValue})
  }

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.query.trim() === '') { 
      alert('Введіть пошуковий запит')
      return;
    }
    this.props.onSubmit(this.state.query.toLowerCase());
    this.setState({ query: '' });
  }

  render() {
    return (
      <header className='Searchbar'>
        <form className='SearchForm' onSubmit={this.handleSubmit}>
          <button type='submit' className='SearchForm-button'>
            <span className='SearchForm-button-label'>Search</span>
          </button>
          <input
            name='search'
            className='SearchForm-input'
            type='text'
            autoComplete='off'
            autoFocus
            placeholder='Search images and photos'
            onChange={this.handleChangeQuery}
            value={this.state.query}
          />
        </form>
      </header>
    )
  }
}

export default Searchbar;

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}