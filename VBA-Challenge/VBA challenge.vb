Sub Stock_Easy()
'Loop through all sheets
For Each ws In Worksheets

'Add column header
ws.Range("H1").Value = "Ticker Symbol"
ws.Range("I1").Value = "Yearly Change"
ws.Range("J1").Value = "Pecentage Change"
ws.Range("K1").Value = "Total Stock Volume"

'Set variables for ticker symbol
Dim ticker_symbol As String

'set variables for yearly close price
Dim yearly_close As Double

'set variables for yearly open price
Dim yearly_open As Double

'set variables for yearly change
Dim yearly_change As Double


'set variables for finding open price
Dim count_row As Double
Dim R As Double
count_row = 0

'set variables for percentage
Dim percentage_c As Double

'set ticker's total
Dim ticker_total As Double
ticker_total = 0

'Set summary_table_row
Dim summary_table_row As Double
summary_table_row = 2

'Determin last row
LastRow = ws.Cells(Rows.Count, 1).End(xlUp).Row

'Loop through all ticker
For i = 2 To LastRow


    'Find ticker's name
    If ws.Cells(i + 1, 1).Value <> ws.Cells(i, 1).Value Then
    'fill the ticker symbol
    ticker_symbol = ws.Cells(i, 1).Value
    'Add to ticker_total
    ticker_total = ticker_total + ws.Cells(i, 7).Value
    'Add yearly_close
    yearly_close = ws.Cells(i, 6).Value
    'Calcuate year change
    yearly_change = yearly_close - yearly_open
    'print symbol in summary table
    ws.Range("H" & summary_table_row).Value = ticker_symbol
    'print total to summary table
    ws.Range("K" & summary_table_row).Value = ticker_total
    'print yearly change in summary table
    ws.Range("I" & summary_table_row).Value = yearly_change
    'print percentage
    ws.Range("J" & summary_table_row).Value = percentage_c
    
     
    'add row to summary table
    summary_table_row = summary_table_row + 1
    'reset count
    count_row = 0
    'reset ticker total
    ticker_total = 0
    'reset
    
    Else
    ticker_total = ticker_total + ws.Cells(i, 7).Value
      'Add to count
    count_row = count_row + 1
    'Find open price
    R = (i - count_row) + 1
    yearly_open = ws.Cells(R, 3).Value
    'calculate percentage
    If yearly_open <> 0 Then
    percentage_c = yearly_change / yearly_open
    ElseIf yearly_open = 0 Then
    percentage_c = yearly_change / 1
    End If
   

End If

 'formating currency
ws.Range("I" & summary_table_row).Style = "Currency"
ws.Range("J" & summary_table_row).Style = "Percent"

   'color yearly change
    If ws.Cells(i, 9).Value > 0 Then
        ws.Cells(i, 9).Interior.ColorIndex = 4
    ElseIf ws.Cells(i, 9).Value < 0 Then
        ws.Cells(i, 9).Interior.ColorIndex = 3
    End If

Next i

'add row name
ws.Cells(2, 14).Value = "ticker"
ws.Cells(2, 15).Value = "Value"
ws.Cells(3, 13).Value = "Greatest % increase"
ws.Cells(4, 13).Value = "Greatest % decrease"
ws.Cells(5, 13).Value = "Greatest Total Vol"

Dim Totalv As Double
Dim Maxval As Double
Dim Minval As Double

'Find greatest Vol
For j = 2 To LastRow
    Totalv = 0
    If ws.Cells(j, 11).Value > Totalv Then
    Totalv = ws.Cells(j, 11).Value
    ws.Range("O5").Value = Totalv
    ws.Range("N5").Value = ws.Cells(j, 8).Value
    End If
Next j

'Find greatest % increase
For k = 2 To LastRow
    If ws.Cells(k, 10).Value > Maxval Then
    Maxval = ws.Cells(k, 10).Value
    ws.Range("O3").Value = Maxval
    ws.Range("N3").Value = ws.Cells(k, 8).Value
    End If
Next k

'Find greatest % decrease
For l = 2 To LastRow
    If ws.Cells(l, 10).Value < Minval Then
    Minval = ws.Cells(l, 10).Value
    ws.Range("O4").Value = Minval
    ws.Range("N3").Value = ws.Cells(l, 8).Value
    End If
Next l

Next ws

End Sub
