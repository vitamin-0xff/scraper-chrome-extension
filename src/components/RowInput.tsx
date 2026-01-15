export type Input = {
    uniqueKey: string;
    value: string;
    label?: string;
    placeholder?: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export type RowInputProps = {
    label?: string;
    inputProps: Input[];
    onChange: (inputUniquekey: string, newValue: string ) => void;
};

export const RowInput = ({inputProps, onChange, label}: RowInputProps) => {
    return (
        <div className="mt-1">
            {
                label && <label style={{ fontSize: 12, fontWeight: 'bold' }}>{label}</label>
            }
            <div style={
                {
                    display: 'grid',
                    gridTemplateColumns: `repeat(${inputProps.length}, minmax(0, 1fr))`,
                    gap: 4
                }
            }>
                {
                    inputProps.map(({ uniqueKey, value, error, label, ...rest }, index) => (
                        <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            {label && <label style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'start' }}>{label}</label>}
                            <input
                                type="number"
                                onChange={(e) => onChange(uniqueKey ,e.currentTarget.value)}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    fontSize: 14,
                                }}
                                {...rest}
                            />
                            {error && (
                                <span style={{ color: 'red', fontSize: 10, marginTop: 2 }}>
                                    {error}
                                </span>
                            )}
                        </div>
                    ))
                }
            </div>
        </div>
    );
}