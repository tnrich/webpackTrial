import ac from 've-api-check';
export default function filterAminoAcidSequenceString(sequenceString) {
    ac.throw(ac.string, sequenceString);
    return sequenceString.replace(/[^galmfwkqespvicyhrnd]/ig, '');
}

