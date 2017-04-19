import getComplementSequenceString from 've-sequence-utils/getComplementSequenceString'
import React from 'react';
import Draggable from 'react-draggable'
import { Decorator as Cerebral } from 'cerebral-view-react';
import { columnizeString, elementWidth, calculateRowLength } from '../utils';
import SelectionLayer from './SelectionLayer';
import _Sequence from './Sequence'
import _Orfs from './Orfs'
import _Features from './Features'
import _CutsiteLabels from './Cutsites/CutsiteLabels'
import _Cutsites from './Cutsites'
import Caret from './Caret'
import Highlight from './Highlight';
import styles from './RowItem.scss';

function noop() {

}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    charWidth: ['charWidth'],
    caretPosition: ['caretPosition'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    cutsites: ['cutsites'],
    cutsitesByName: ['cutsitesByName'],
    letterSpacing: ['letterSpacing'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    searchLayers: ['searchLayers'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceHeight: ['sequenceHeight'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
})

class RowItem extends React.Component {

    render() {
        var {
            annotationHeight,
            bpsPerRow,
            caretPosition,
            charWidth,
            className,
            componentOverrides={},
            letterDistance,
            row,
            searchLayers=[],
            searchRows,
            selectionLayer={start: -1, end: -1},
            sequenceData,
            sequenceHeight,
            sequenceLength,
            showCutsites,
            showFeatures,
            showOrfs,
            showReverseSequence,
            signals,
            spaceBetweenAnnotations,
            tickSpacing,
            width,
            selectionStart,
            selectionEnd,
        } = this.props;

        var {
            sequence='',
            features= [],
            translations= [],
            cutsites= [],
            orfs= [],
        } = row

        var reverseSequence = getComplementSequenceString(sequence);

        if (!row) {
            return null;
        }

        var {
            Sequence = _Sequence,
        //     Axis = _Axis,
            Orfs = _Orfs,
        //     Translations = _Translations,
            Features = _Features,
            CutsiteLabels = _CutsiteLabels,
            Cutsites = _Cutsites,
        } = componentOverrides

        var annotationCommonProps = {
            bpsPerRow,
            charWidth,
            letterDistance,
            row,
            sequenceHeight,
            sequenceLength,
            annotationHeight,
            signals,
        }

        var rowNumber = row.start + 1; // we want to start at 1 and not 0

        var selectedStuff = [];

        // nothing selected, just put a caret at position 0
        if (caretPosition !== -1 && !selectionLayer.selected) {
            selectedStuff.push(
                <Caret
                    row = {row}
                    sequenceLength = {sequenceLength}
                    caretPosition = {caretPosition}
                    />
            );
        }

        var searchHighlight = [];
        if (searchRows && searchRows.length > 0) {
            let i = 0;
            searchRows.forEach(function(result) {
                searchHighlight.push(
                    <Highlight key={i} start={result.start} end={result.end} rowStart={row.start} rowEnd={row.end} color={"yellow"}/>
                );
                i += 1;
            });
        } else {
            searchHighlight = <div></div>;
        }

        return (
            <div id={Math.floor(row.start / bpsPerRow)} // id is row-number
                className={"veRowItem", styles.rowItem}>

                <div className={styles.margin}>
                    { rowNumber }
                </div>

                {(showFeatures && Object.keys(features).length > 0) &&
                    <Features
                        annotationRanges={features}
                        {...annotationCommonProps}
                        />
                }

                {(showOrfs && Object.keys(orfs).length > 0) &&
                    <Orfs
                        annotationRanges={orfs}
                        signals={signals}
                        {...annotationCommonProps}
                        />
                }

                {(showCutsites && Object.keys(cutsites).length > 0) &&
                    <CutsiteLabels
                        annotationRanges={cutsites}
                        {...annotationCommonProps}
                        />
                }

                { selectionStart }
                <Highlight start={selectionLayer.start} end={selectionLayer.end} rowStart={row.start} rowEnd={row.end} />
                { selectionEnd }

                { searchHighlight }

                <div className='veRowItemSequenceContainer'>
                    <Sequence
                        reverse="false"
                        sequence={sequence}
                        {...annotationCommonProps}
                        >
                        {(showCutsites && Object.keys(cutsites).length > 0) &&
                            <Cutsites
                                sequenceLength={sequenceLength}
                                annotationRanges={cutsites}
                                topStrand={true}
                                {...annotationCommonProps}
                                />
                        }
                    </Sequence>

                    {showReverseSequence &&
                        <Sequence
                            reverse="true"
                            sequence={reverseSequence}
                            {...annotationCommonProps}
                            >
                            {(showCutsites && Object.keys(cutsites).length > 0) &&
                                <Cutsites
                                    sequenceLength={sequenceLength}
                                    annotationRanges={cutsites}
                                    topStrand={false}
                                    {...annotationCommonProps}
                                    />
                            }
                        </Sequence>
                    }
                </div>

            </div>
        );
    }
}

module.exports = RowItem;
