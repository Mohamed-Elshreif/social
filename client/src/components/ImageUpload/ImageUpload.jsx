import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { update } from "../../features/userSlice";
import { showModal } from "../../features/modalSlice";
import useFetch from "../../hooks/useFetch";
import Compress from "compress.js";
import Compressor from 'compressorjs';

import { updateDPService } from "../../services/userServices";
import "./imageupload.css";
import { getUsers } from "../../features/usersSlice";

const ImageUpload = ({ close }) => {
	const [image, setImage] = useState(null);
	const [image1, setImage1] = useState(null);
	const [preview, setPreview] = useState(null);

	const dispatch = useDispatch();
	const customFetch = useFetch();
	const compress = new Compress();
	
	const loadImage = e => {
		const file = e.target;
		if (!file) return;
		var reader = new FileReader();
		reader.onload = function (e) {
			setPreview(e.target.result);
		};
		file.files[0] && reader.readAsDataURL(file.files[0]);
		const files = [...file.files];
		// compress
		// 	.compress(files, {
		// 		size: 0.5,
		// 		quality: 0.75,
		// 		maxWidth: 1000,
		// 		maxHeight: 1000,
		// 		resize: true,
		// 		rotate: false,
		// 	})
		// 	.then(data => {
		// 		setImage(Compress.convertBase64ToFile(data[0]?.data, data[0]?.ext));
		// 	});
			new Compressor(file.files[0], {
				quality: 0.75,
				maxWidth: 1000,
				maxHeight: 1000,
				resize: "cover",
				convertSize: 0.5,
				success: (compressedResult) => { 
				  setImage(compressedResult)
				},
			  });
	};
console.log(image)
	const submitHandler = async e => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("image", image);
		dispatch(showModal({}));
		const data = await customFetch(updateDPService, formData);
		if (data) {
			dispatch(getUsers({ customFetch }));
			dispatch(update({ profileImage: data.user.profileImage, id: data.user._id }));
			close();
			dispatch(showModal({ msg: "Success" }));
			setImage(null);
			setPreview(null);
		}
	};

	return (
		<form onSubmit={submitHandler} className="imageupload">
			{preview && <img src={preview} alt="upload-preview" />}
			<div className="btns">
				<label htmlFor="dp-image">Upload</label>
				<input type="file" id="dp-image" accept="image/png, image/jpeg" onChange={loadImage} />
				{image && <button type="submit">Submit</button>}
				<button onClick={close} type="reset">
					Cancel
				</button>
			</div>
		</form>
	);
};

export default ImageUpload;
