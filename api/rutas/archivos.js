var xl = require('excel4node');
var express = require('express');
var api = express.Router();

api.get('/excel4node', function (req, res) {
    // Create a new instance of a Workbook class
    var wb = new xl.Workbook();
    var style = {
        border: { // §18.8.4 border (Border)
            left: {
                style: "medium", //§18.18.3 ST_BorderStyle (Border Line Styles) ['none', 'thin', 'medium', 'dashed', 'dotted', 'thick', 'double', 'hair', 'mediumDashed', 'dashDot', 'mediumDashDot', 'dashDotDot', 'mediumDashDotDot', 'slantDashDot']
                color: "#000000" // HTML style hex value
            },
            right: {
                style: "medium",
                color: "#000000"
            },
            top: {
                style: "medium",
                color: "#000000"
            },
            bottom: {
                style: "medium",
                color: "#000000"
            }
        }
    }
    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1');
    ws.cell(1, 1).string('My simple string');
    ws.cell(1, 2).number(5);
    ws.cell(1, 3).formula('B1 * 10');
    ws.cell(1, 4).date(new Date());
    ws.cell(1, 5).link('http://iamnater.com');
    ws.cell(1, 6).bool(true);

    ws.cell(2, 4, 2, 9, true).string('One big merged cell').style(style);
    ws.cell(3, 1, 3, 6).number(1); // All 6 cells set to number 1

    var complexString = [
        'Workbook default font String\n',
        {
            bold: true,
            underline: true,
            italic: true,
            color: 'FF0000',
            size: 18,
            name: 'Courier',
            value: 'Hello'
        },
        ' World!',
        {
            color: '000000',
            underline: false,
            name: 'Arial',
            vertAlign: 'subscript'
        },
        ' All',
        ' these',
        ' strings',
        ' are',
        ' black subsript,',
        {
            color: '0000FF',
            value: '\nbut',
            vertAlign: 'baseline'
        },
        ' now are blue'
    ];
    ws.cell(4, 1).string(complexString);
    ws.cell(5, 1).string('another simple string').style({ font: { name: 'Helvetica' } });;

    wb.write('../docs/Excel2.xlsx', function (err) {
        if (err) throw err
        else {
            res.send("ok");
        }
    });
});
module.exports = api;