import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';
import { useRequest } from '../../hooks/use-request';

const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const router = useRouter();

    const { doRequest, errors } = useRequest({
        method: 'post',
        url: '/api/tickets',
        body: {
            title,
            price,
        },
        onSuccess() {
            router.push('/');
        },
    });

    const submitHandler = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const data = await doRequest();
            console.log(data);
            setPrice('');
            setTitle('');
        } catch (error) {
            console.error(error);
        }
    };

    const blurHandler = () => {
        const value = parseFloat(price);
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2));
    };

    return (
        <div>
            <h1>Create a Ticket</h1>
            <form onSubmit={submitHandler}>
                <div className='form-group'>
                    <label>Title</label>
                    <input
                        className='form-control'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className='form-group'>
                    <label>Price</label>
                    <input
                        className='form-control'
                        value={price}
                        onBlur={blurHandler}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </div>
                {errors}
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    );
};

export default NewTicket;
