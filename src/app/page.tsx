'use client'



import SelectBox from "@/shared/ui/Select/Select";

export default function Home() {
    return (
        <div>
            <main style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>

                {/* Селекты*/}
                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {/* Простой селект с defaultValue */}
                    <SelectBox
                        options={[{value: 'option1', label: 'Select Box 1'},
                            {value: 'option2', label: 'Select Box 2'},
                            {value: 'option3', label: 'Select Box 3'}]}
                        defaultValue="option1"
                        onValueChange={(value) => console.log('Simple selected:', value)}
                        placeholder="Select Box"
                        label="Простой селект"
                    />

                    {/* Обязательный селект */}
                    <SelectBox
                        options={[{value: 'option1', label: 'Select Box 1'},
                            {value: 'option2', label: 'Select Box 2'},
                            {value: 'option3', label: 'Select Box 3'}]}
                        onValueChange={(value) => console.log('Required selected:', value)}
                        placeholder="Выберите обязательную опцию"
                        label="Обязательный селект"
                        required
                    />

                    {/* Отключенный селект */}
                    <SelectBox
                        options={[{value: 'option1', label: 'Select Box 1'},
                            {value: 'option2', label: 'Select Box 2'},
                            {value: 'option3', label: 'Select Box 3'}]}
                        defaultValue="option2"
                        placeholder="Выберите опцию"
                        label="Отключенный селект"
                        disabled
                    />
                </div>
            </main>
        </div>
    );
}