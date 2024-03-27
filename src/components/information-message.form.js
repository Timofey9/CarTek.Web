import React, { useEffect, useState } from 'react';
import ApiService from "../services/cartekApiService";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function MessageForm({handleClose }) {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState(0);
    const [loading, setLoading] = useState(true);

    const validate = () => {
        if (message.length === 0) {
            alert("Нужно заполнить cообщение");
            return false;
        } else
            return true;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const newMessage = {
            message: message,
            messageType: messageType
        };

        if (validate()) {
            ApiService.createinformationmessage(newMessage)
                .then(({ data }) => {
                    alert(data.message);
                }).
                catch((error) => {
                    alert(error.response.data.message);
                });
            }
    }    

    return (
        <div className="m-5">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                    {error}
                </div>
            </div>

            <h1 className="mt-3">Добавить тип груза</h1>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label>Сообщение</label>
                    <input
                        type="text"
                        className="form-control"
                        form="profile-form"
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                    />
                </div>
            </div>            
            <div className="form-row">
                <div className="form-group col-md-6">
                        <FormControl>
                            <FormLabel id="radio-buttons-group-label">Тип сообщения</FormLabel>
                            <RadioGroup
                                aria-labelledby="radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={messageType}
                            onChange={(e) => setMessageType(e.target.value)}>
                                <FormControlLabel value="0" control={<Radio />} label="Для водителей КарТэк" />
                                <FormControlLabel value="1" control={<Radio />} label="Для наемных водителей" />
                                <FormControlLabel value="2" control={<Radio />} label="Для всех" />
                            </RadioGroup>
                        </FormControl>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col-md-3"></div>
                <div className="col-md-6">
                    <div className="row">
                        <div className="col-md-2 m-3">
                            <button onClick={() => handleClose()} className="btn btn-warning mr-1">
                                Отмена
                            </button>
                        </div>
                        <div className="col-md-2 m-3">
                            <button type="submit" form="profile-form" className="btn btn-success" onClick={(e) => { handleSubmit(e) }}>
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}

export default MessageForm;
