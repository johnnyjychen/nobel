import indexImage from '../images/index_pic.png';
import noFoundImage from '../images/nofound.png';
import { useEffect, useState } from 'react';

const NobelPrizes = () => {
    const [nobelPrizeWinners, setNobelPrizeWinners] = useState([]);
    const [Name, setName] = useState('');
    const [Category, setCategory] = useState('');
    const [Year, setYear] = useState('');
    const [filteredWinners, setFilteredWinners] = useState([]);
    const [save, setSave] = useState(() => {
        const localData = localStorage.getItem('save');
        return localData ? JSON.parse(localData) : [];
    });
    const [hasFilter, setHasFilter] = useState(false);

    useEffect(() => {
        fetch('https://gist.githubusercontent.com/saltcod/5c45c5bba1e41729f633a2a1ab41a763/raw/108753abefda20b32addc5d6e6ceb5ab87f5e323/nobel-prize.json')
            .then(response => response.json())
            .then(data => setNobelPrizeWinners(data.prizes))
    }, []);

    useEffect(() => {
        localStorage.setItem('save', JSON.stringify(save));
    }, [save]);

    useEffect(() => {const isFilterApplied = Name || Category || Year;
        setHasFilter(isFilterApplied);

        if (!Name && !Category && !Year) {
            setFilteredWinners([]);
            return;
        }
        const results = nobelPrizeWinners.filter(prize =>
            (Category ? prize.category === Category : true) &&
            (Year ? prize.year === Year : true) &&
            (prize.laureates?.some(laureate =>
                laureate.firstname.toLowerCase().includes(Name.toLowerCase()) ||
                laureate.surname.toLowerCase().includes(Name.toLowerCase()))
            )
        );
        setFilteredWinners(results);
    }, [Name, Category, Year, nobelPrizeWinners]);

    const addToSave = (laureate, category, year) => {
        const newFavorite = { ...laureate, category, year };
        setSave([...save, newFavorite]);
    };

    const removeFromSave = (id) => {
        setSave(save.filter(savedItem => savedItem.id !== id));
    };

    const formatMotivation = (motivation) => {
        if (!motivation) return "Sorry, there's no explanation about why they won the prize.";
        const cleanMotivation = motivation.replace(/^"|"$/g, '').trim();
        return `The reason they won the prize: ${cleanMotivation.charAt(0).toUpperCase() + cleanMotivation.slice(1)}${cleanMotivation.endsWith('.') ? '' : '.'}`;
    };

    const capitalizeFirstLetter = (text) => {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    };

    return (
        <div>
            <h1>Nobel Prize Winners (1901 - 2017)</h1>
            {/* Three search features */}
            <div>
                <input
                    type="text"
                    value={Name}
                    onChange={e => setName(e.target.value)}
                    placeholder="🔍 Search by name..."
                />
                <input
                    type="text"
                    value={Year}
                    onChange={e => setYear(e.target.value)}
                    placeholder="🔍 Search by year..."
                />
                <select
                    value={Category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="">🔍 Select a category</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="medicine">Physiology or Medicine</option>
                    <option value="literature">Literature</option>
                    <option value="peace">Peace</option>
                    <option value="economics">Economics</option>
                </select>
            </div>

            {/* Display filtered winners */}
            <div>
                {filteredWinners.length > 0 ? (
                    filteredWinners.map((prize, index) => (
                        <div key={index} className="overall_layout">
                            <h2>{prize.year} - {capitalizeFirstLetter(prize.category)}</h2>
                            {prize.laureates?.map(laureate => (
                                <div key={laureate.id} className="display_background">
                                    <h3>{laureate.firstname} {laureate.surname}</h3>
                                    <p>{formatMotivation(laureate.motivation)}</p>
                                    <button onClick={() => addToSave(laureate, prize.category, prize.year)}>Save</button>
                                </div>
                            ))}
                        </div>
                    ))
                ) : hasFilter ? (
                    <div>
                        <h2>No results found:&#40;</h2>
                        <img src={noFoundImage} alt="No found image" className='img_size' />
                    </div>
                ) : (
                    <div>
                        <h2>Please select a filter to see the Nobel Prize winners.</h2>
                        <img src={indexImage} alt="The index image" className='img_size' />
                    </div>
                )}
            </div>

            {/* The save feature */}
            <h1 className='savedItem'>Saved</h1>
            <div>
                {save.map((savedItem, index) => (
                    <div key={index} className="overall_layout">
                        <h2>{savedItem.firstname} {savedItem.surname} - {savedItem.year} - {capitalizeFirstLetter(savedItem.category)}</h2>
                        <p>{formatMotivation(savedItem.motivation)}</p>
                        <button onClick={() => removeFromSave(savedItem.id)}>Remove</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NobelPrizes;