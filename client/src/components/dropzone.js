import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '50px 20px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out'
};

const focusedStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

function Basic(props) {
	const { className, title, disabled, accept, maxFiles, onDrop } = props;
	const dropzoneMethod = {
		disabled: !!disabled,
		accept: accept || "",
		maxFiles: maxFiles || 0,
		onDrop: onDrop || ""
	}
	const {
		acceptedFiles,
		getRootProps,
		getInputProps,
		isFocused,
		isDragAccept,
		isDragReject
	} = useDropzone(dropzoneMethod);
	const dragNDropText = title || "Drag 'n' drop some files here, or click to select files";

	const style = useMemo(() => ({
		...baseStyle,
		...(isFocused ? focusedStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isFocused,
		isDragAccept,
		isDragReject
	]);

	// const files = acceptedFiles.map(file => (
	// 	<li key={file.path}>
	// 		{file.path} - {file.size} bytes
	// 	</li>
	// ));

	return (
		<section className="container">
			<div {...getRootProps({ className: 'dropzone ' + className, style })}>
				<input {...getInputProps()} />
				{acceptedFiles.length
					? acceptedFiles.map(file => (<img src={URL.createObjectURL(file)} alt={file.name} style={{ height: 150 }} />))
					: <p className='my-auto'>{dragNDropText}</p>
				}
			</div>
		</section>
	);
}

export default Basic;
