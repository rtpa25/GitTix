import 'bootstrap/dist/css/bootstrap.css';
import type { AppContext, AppProps } from 'next/app';
import { buildClient } from '../api/build-client';
import Header from '../components/header';
import { CurrentUserResult } from '../types/user';

type AppComponentProps = AppProps & CurrentUserResult;

const AppComponent = ({
    Component,
    pageProps,
    currentUser,
}: AppComponentProps) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    );
};

AppComponent.getInitialProps = async (appContext: AppContext) => {
    const axiosClient = buildClient(appContext.ctx.req);
    const { data } = await axiosClient.get<CurrentUserResult>(
        '/api/users/currentuser'
    );

    let pageProps = {};

    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps?.(
            appContext.ctx
        );
    }

    return {
        pageProps,
        ...data,
    };
};

export default AppComponent;
