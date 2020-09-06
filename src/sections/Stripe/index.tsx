import React, { useEffect, useRef } from 'react';
import { Redirect, useHistory } from 'react-router-dom'
import { useMutation } from '@apollo/client';
import { Layout, Spin } from 'antd'
import { CONNECT_STRIPE } from '../../lib/graphql/mutations/ConnectStripe';
import { ConnectStripe as ConnectStripeData, ConnectStripeVariables } from '../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe';
import useViewerState from '../../lib/context/useViewerState';
import { displaySuccessNotification } from '../../lib/utils';

const { Content } = Layout

export const Stripe = () => {
    const { viewer, setViewer } = useViewerState();
    const history = useHistory();
    const [connectStripe, { data, loading, error }] = useMutation<ConnectStripeData, ConnectStripeVariables>(CONNECT_STRIPE, {
        onCompleted: (data) => {
            if (data && data.stripeConnect) {
                setViewer({ ...viewer, hasWallet: data.stripeConnect.hasWallet })
            }
            displaySuccessNotification(
                "You've successfully connected your Stripe Account!",
                "You can now begin to create listings in the Host page."
            );
        }
    })

    const connectStripeRef = useRef(connectStripe);

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');
        if (code) {
            connectStripeRef.current({
                variables: {
                    input: { code }
                }
            })
        } else {
            history.replace('/login')
        }
    }, [history])

    if (loading) {
        return (
            <Content className="stripe">
                <Spin size="large" tip="Connecting your Stripe account..." />
            </Content>
        );
    }

    if (data && data.stripeConnect) {
        return <Redirect to={`/user/${viewer.id}`} />;
    }

    if (error) {
        return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />
    }

    return null;
}
