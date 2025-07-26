import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { completeOnboarding } from '../lib/api';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';


const OnboardingPage = () => {
  const {authUser} = useAuthUser();
  const queryClient = useQueryClient();
  const[formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio:authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePicture: authUser?.profilePicture || "",
  });

  const {mutate:onboardingMutation, isPending}=useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully!");
      queryClient.invalidateQueries({queryKey:["authUser"]});
    },
    onError:(error)=>{
      toast.error(error.response.data.message);
      console.error("Onboarding Error:", error);
    }
  });

  const handleSubmit = (e) =>{
    e.preventDefault();
    onboardingMutation(formState);
  }

  const handleRandomAvatar = () => {
    const idx=Math.floor(Math.random()*100)+1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePicture: randomAvatar });
    toast.success("Avatar changed successfully!");
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-base-100'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
        <h1 className='text-2xl font-bold sm:text-3xl text-center mb-6'>Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Profile Pic Container */}
          <div className='flex flex-col items-center justify-center space-y-4'>
            {/* Image Preview */}
            <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
              {formState.profilePicture ? (
                <img 
                src={formState.profilePicture} 
                alt="Profile Preview" 
                className='w-full h-full object-cover'
                />
              ):(
                <div className='flex items-center justify-center h-full'>
                  <CameraIcon className='size-12 text-base-content opacity-40' />
                </div>
              )}

            </div>

            {/*Generate Random Avatar BTN*/}
            <div className='flex items-center gap-2'>
              <button type="button" onClick={handleRandomAvatar} className="btn btn-accent rounded-full">
                <ShuffleIcon className='size-4 mr-2' />
                Generate Random Avatar
              </button>
            </div>
          </div>
                      {/*FULL NAME*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full"
                placeholder='Your Full Name'
                required
              />
            </div>

            {/*BIO*/}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder='Tell us about yourself'
              />
            </div>

            {/*LANGUAGES*/}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               {/*NATIVE LANGUAGE*/}  
                <div className='form-control'>
                  <label className="form-control">
                    <span className='label-text'>Native Language</span>
                  </label>
                  <select
                    name="nativeLanguage"
                    value={formState.nativeLanguage}
                    onChange={(e)=>setFormState({...formState, nativeLanguage: e.target.value})}
                    className='select select-bordered w-full'
                  >
                    <option value="">Select your native language</option>
                    {LANGUAGES.map((language) => (
                      <option key={`native-${language}`} value={language.toLowerCase()}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
                {/*LEARNING LANGUAGE*/}
                <div className='form-control'>
                  <label className="form-control">
                    <span className='label-text'>Learning Language</span>
                  </label>
                  <select
                    name="learningLanguage"
                    value={formState.learningLanguage}
                    onChange={(e)=>setFormState({...formState, learningLanguage: e.target.value})}
                    className='select select-bordered w-full'
                  >
                    <option value="">Select your learning language</option>
                    {LANGUAGES.map((language) => (
                      <option key={`learning-${language}`} value={language.toLowerCase()}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
            </div>

            {/*LOCATION*/}
            <div className='form-control'>
              <label className="label">
                <span className='label-text'>Location</span>
              </label>
              <div className='relative'>
                <MapPinIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content opacity-70' />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder='Your Location'
                />
              </div>
            </div>

            {/*SUBMIT BUTTON*/}

            <button className='btn btn-primary w-full mt-4' disabled={isPending} type='submit'>
              {!isPending ? (
                <>
                  <ShipWheelIcon className='size-4 mr-2'/>
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className='animate-spin size-4 mr-2'/>
                  Onboarding...
                </>
              )}
            </button>
        </form>
        </div>

      </div>
    </div>
  );
}

export default OnboardingPage
