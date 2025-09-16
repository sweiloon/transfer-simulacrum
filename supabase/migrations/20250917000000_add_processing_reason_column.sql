-- Add processing_reason column to transfer_history table
ALTER TABLE transfer_history
ADD COLUMN processing_reason TEXT;

-- Add comment to the column
COMMENT ON COLUMN transfer_history.processing_reason IS 'Processing reason for the transfer, optional free text field';