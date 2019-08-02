import React, { PureComponent } from 'react';
import { Error } from '../Error';

interface ErrorBoundaryState {
  error: any;
  info: any;
}

export class ErrorBoundary extends PureComponent<{}, ErrorBoundaryState> {
  state = {
    error: null,
    info: null,
  };

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({error, info: errorInfo});
  }

  render() {
    if (this.state.error) {
      console.log(this.state);
      return <Error/>;
    }
    return this.props.children;
  }
}
