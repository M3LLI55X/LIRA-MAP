//Christian Wu - s194597
import { FC, useState } from "react";
import DatePicker from "react-date-picker";
import Select from 'react-select';
import { TripsOptions } from "../../models/models";
import Checkbox from "../Checkbox";

const defaultOptions: TripsOptions = {
    search: '',
    startDate: new Date("2020-01-01"),
    endDate: new Date(),
    reversed: false,
}

interface IOptionsSelector {
    onChange: (options: TripsOptions) => void;
}

export let chosenMunicipality = ""

const OptionsSelector: FC<IOptionsSelector> = ({ onChange }) => {

    const [options, setOptions] = useState<TripsOptions>(defaultOptions)

    const municipalities = ['Aabenraa Kommune', 'Aalborg Kommune', 'Aarhus Kommune', 'Albertslund Kommune', 'Allerød Kommune', 'Assens Kommune', 'Ballerup Kommune', 'Billund Kommune', 'Bornholms Regionskommune', 'Brøndby Kommune', 'Brønderslev Kommune', 'Dragør Kommune', 'Egedal Kommune', 'Esbjerg Kommune', 'Faaborg-Midtfyn Kommune', 'Fanø Kommune', 'Favrskov Kommune', 'Faxe Kommune', 'Fredensborg Kommune', 'Fredericia Kommune', 'Frederiksberg Kommune', 'Frederikshavn Kommune', 'Frederikssund Kommune', 'Furesø Kommune', 'Gentofte Kommune', 'Gladsaxe Kommune', 'Glostrup Kommune', 'Greve Kommune', 'Gribskov Kommune', 'Guldborgsund Kommune', 'Haderslev Kommune', 'Halsnæs Kommune', 'Hedensted Kommune', 'Helsingør Kommune', 'Herlev Kommune', 'Herning Kommune', 'Hillerød Kommune', 'Hjørring Kommune', 'Holbæk Kommune', 'Holstebro Kommune', 'Horsens Kommune', 'Hvidovre Kommune', 'Høje-Taastrup Kommune', 'Hørsholm Kommune', 'Ikast-Brande Kommune', 'Ishøj Kommune', 'Jammerbugt Kommune', 'Kalundborg Kommune', 'Kerteminde Kommune', 'Kolding Kommune', 'Københavns Kommune', 'Køge Kommune', 'Langeland Kommune', 'Lejre Kommune', 'Lemvig Kommune', 'Lolland Kommune', 'Lyngby-Taarbæk Kommune', 'Læsø Kommune', 'Mariagerfjord Kommune', 'Middelfart Kommune', 'Morsø Kommune', 'Norddjurs Kommune', 'Nordfyns Kommune', 'Nyborg Kommune', 'Næstved Kommune', 'Odder Kommune', 'Odense Kommune', 'Odsherred Kommune', 'Randers Kommune', 'Rebild Kommune', 'Ringkøbing-Skjern Kommune', 'Ringsted Kommune', 'Roskilde Kommune', 'Rudersdal Kommune', 'Rødovre Kommune', 'Samsø Kommune', 'Silkeborg Kommune', 'Skanderborg Kommune', 'Skive Kommune', 'Slagelse Kommune', 'Solrød Kommune', 'Sorø Kommune', 'Stevns Kommune', 'Struer Kommune', 'Svendborg Kommune', 'Syddjurs Kommune', 'Sønderborg Kommune', 'Thisted Kommune', 'Tårnby Kommune', 'Tønder Kommune', 'Vallensbæk Kommune', 'Varde Kommune', 'Vejen Kommune', 'Vejle Kommune', 'Vesthimmerlands Kommune', 'Viborg Kommune', 'Vordingborg Kommune', 'Ærø Kommune']

    const municipalityOptions: any = []

    municipalities.forEach(function (element) {
        municipalityOptions.push({ label: element, value: element })
    })

    const setMunicipality = (m: any) => {
        chosenMunicipality = m === null ? "" : m.value;
    }

    const _onChange = (key: keyof TripsOptions) => {
        return function <T>(value: T) {
            const temp = { ...options } as any
            temp[key] = value;
            setOptions(temp)
            onChange(temp)
        }
    }

    const colourStyles = {

        control: (base: any, state: { isFocused: any; }) => ({
            ...base,
            background: "white",

            // match with the menu
            // borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
            // Overwrittes the different states of border
            // borderColor: state.isFocused ? "yellow" : "green",
            // Removes weird border around container
            // boxShadow: state.isFocused ? null : null,
            //"&:hover": {
            // Overwrittes the different states of border
            //  borderColor: state.isFocused ? "red" : "blue"
            //  }
        }),

        menuList: (styles: any) => ({
            ...styles,
            background: 'white',
        }),
        option: (styles: any, { isFocused, isSelected }: any) => ({
            ...styles,
            background: isFocused
                ? '#37B4FF'
                : isSelected
        }),
        menu: (base: any) => ({
            ...base,
            zIndex: 100
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: 'rgb(68, 67, 67)',
            whiteSpace: "normal",
        }),

    }

    return (
        <div className="rides-options">
            <input
                className="ride-search-input"
                placeholder='Filter Search.'
                value={options.search}
                onChange={e => _onChange('search')(e.target.value)} />
            <Select
                className="ride-municipality-selector"
                placeholder="Select municipality"
                options={municipalityOptions}
                isClearable isSearchable
                onChange={m => setMunicipality(m)}
                styles={colourStyles}

            ></Select>

            <DatePicker onChange={_onChange('startDate')} value={options.startDate} className="options-date-picker" />
            <DatePicker onChange={_onChange('endDate')} value={options.endDate} className="options-date-picker" />

            <Checkbox
                className="ride-sort-cb"
                html={<div>Sort {options.reversed ? '▼' : '▲'}</div>}
                onClick={_onChange('reversed')} />
        </div>

    )
}

export default OptionsSelector;