import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

export class News extends Component {

  static defaultProps = {
    country: "us",
    pageSize: 6,
    category: "general"
  }

  static propTypes ={
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase()+string.slice(1);
  }

  constructor(props){
      super(props);
      this.state = {
        articles : [],
        loading : true,
        page: 1,
        totalResults: 0
      }
      document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`
    }

  async updateNews(){
    this.props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}`;
    this.setState({loading:true});
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: parsedData.articles,
      totalResults:parsedData.totalResults,
      loading: false
    })
    this.props.setProgress(100);
  }

  async componentDidMount(){
    this.updateNews();
  }

  // handlePreClick = async () => {
  //   console.log("Previous");
  //   this.setState({
  //     page: this.state.page-1
  //   })
  //   this.updateNews();

  // }

  // handleNextClick = async () => {
  //   this.setState({
  //     page: this.state.page+1
  //   })
  //   this.updateNews();
  // }

  fetchMoreData = async () => {
   const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({
      articles: this.state.articles.concat(parsedData.articles),
      totalResults:parsedData.totalResults,
    })
  };

    render() {
      return (
        <>
          <h1 className="text-center" style={{margin:"35px 0px"}}>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} headlines</h1>
          {this.state.loading && <Spinner/>}
          <InfiniteScroll
          dataLength={this.state.articles.length !== this.state.totalResults}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length}
          loader={this.state.loading && <Spinner/>}
          >
            <div className="container">
              <div className = "row">
                {this.state.articles.map((element,index)=>{
                  return <div className="col-md-4" key={index}>
                  <NewsItem title ={element.title?element.title:""} description={element.description?element.description:""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                  </div>
                })}      
              </div>
            </div>
        </InfiniteScroll>
          {/* <div className="container d-flex justify-content-between">
          <button disabled = {this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePreClick}>&laquo; Previous</button>
          <button disabled = {this.state.page + 1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &raquo;</button>
          </div> */}
        </> 
      )
    }
  }
export default News
