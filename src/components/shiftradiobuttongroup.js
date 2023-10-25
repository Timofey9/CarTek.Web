import React, { Fragment } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function ShiftRadioButtonGroup({value, onChange, disabled}) {
    return (<FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Смена</FormLabel>
        <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="0"
                name="radio-buttons-group"
                value={value}
                onChange={onChange}>
                <FormControlLabel disabled={disabled ?? false} value="0" control={<Radio />} label="Ночь (20:00 - 08:00)" />
                <FormControlLabel disabled={disabled ?? false} value="1" control={<Radio />} label="День (08:00 - 20:00)" />
                <FormControlLabel disabled={disabled ?? false} value="2" control={<Radio />} label="Сутки" />
                <FormControlLabel disabled={disabled ?? false} value="3" control={<Radio />} label="Сутки (неограниченно)" />
            </RadioGroup>
        </FormControl>);
}

export default ShiftRadioButtonGroup;