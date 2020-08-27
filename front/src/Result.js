import React from 'react';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { LoadScreen, EnableLoadScreen, DisableLoadScreen } from './components/LoadScreen'
import SideBar from './components/SideBar'
import ResultGrid from './components/ResultGrid'
import './styles/Result.css'
import $ from 'jquery'
import { getSuggestions } from './components/API'




class Result extends React.Component {
  constructor(props) {
    super(props)
    this.props = props;
    this.state = {activeFilter:{}};
    this.addFilter = this.addFilter.bind(this)
    this.removeFilter = this.removeFilter.bind(this)
    this.addSort = this.addSort.bind(this)
    this.removeSort = this.removeSort.bind(this)
  }

  addFilter(categ, filter){
    if(this.state.activeFilter[categ] == null){ 
      this.setState({
        activeFilter: {...this.state.activeFilter, ...{[categ]: [filter]}},
      })
    }
    else{
      let prev_filters = this.state.activeFilter;
      prev_filters[categ].push(filter);
      this.setState({
        activeFilter: prev_filters,
      })
    }
  }

  removeFilter(categ, filter){
    let prev_filters = this.state.activeFilter;
    const index = prev_filters[categ].indexOf(filter);
    if (index > -1) {
      prev_filters[categ].splice(index, 1);
    }
    this.setState({
      activeFilter: prev_filters,
    })
  }

  addSort(sort_option, sort_arrange){
    this.setState({
      activeSort: {sort_option, sort_arrange}
    })
  }

  removeSort(){
    this.setState({
      activeSort: null
    })
  }

  componentDidMount() {
    EnableLoadScreen();
    $.ajax({
      type: "POST",
      async: true,
      url: getSuggestions,
      data:{
        link: this.props.match.params.link,
      },
    }).done(response => {
      return $.parseJSON(response)
    }).then(jsn => JSON.parse(jsn)
    ).then(parsed_jsn => {
      this.setState({
        items: parsed_jsn.items,
        filters: parsed_jsn.filters,
        image_info: parsed_jsn.image_info,
        found_clothes: parsed_jsn.found_clothes,
        sort: parsed_jsn.sort
      })
      DisableLoadScreen();
    });
  }


  render() {
    let link = this.props.match.params.link;
    return (
      <>
        <header>
          <Navbar />
        </header>
        <div className='result'>
          <SideBar 
            link={link} 
            filters={this.state.filters} 
            image_info={this.state.image_info}
            found_clothes={this.state.found_clothes} 
            sort={this.state.sort}
            addFilter = {this.addFilter}
            removeFilter = {this.removeFilter}
            addSort = {this.addSort}
            removeSort = {this.removeSort}
            addSort = {this.addSort}
          />
          <ResultGrid 
            link={link} 
            items={this.state.items} 
            filter={this.state.activeFilter}
            sort={this.state.activeSort}/>
        </div>
        {/* <Footer /> */}
        <LoadScreen display={true}/>
      </>
    )
  }
}

function Result2(props) {
  let link = props.match.params.link;

  return (
    <>
      <header>
        <Navbar />
      </header>
      <div className='result'>
        <SideBar link={link} />
        <ResultGrid link={link} />
      </div>
      <LoadScreen />
    </>
  );
}

export default Result;
